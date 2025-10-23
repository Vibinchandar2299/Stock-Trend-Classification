from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'voting_rf_gb_svr_price_change.joblib')
model = None

# This will only print once when the module is first loaded
if __name__ != '__main__':
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            # Print expected features
            if hasattr(model, 'feature_names_in_'):
                print(f"Model expects {len(model.feature_names_in_)} features:")
                print(list(model.feature_names_in_))
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}")
            print("Please place your trained model at backend/model/voting_rf_gb_svr_price_change.joblib")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    # This will run when the script is executed directly
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")

def engineer_features(open_price, close_price, high_price, low_price, volume):
    """
    Engineer features from basic OHLCV data to match model training
    Model expects: ['open_price', 'close_price', 'high_price', 'low_price', 'volume', 
                    'price_change_percent', 'volatility', 'moving_avg_5', 'moving_avg_10', 
                    'rsi', 'macd', 'bollinger_upper', 'bollinger_lower', 'momentum', 'avg_volume_5']
    """
    features = {}
    
    # Basic prices (required by model)
    features['open_price'] = open_price
    features['close_price'] = close_price
    features['high_price'] = high_price
    features['low_price'] = low_price
    features['volume'] = volume
    
    # Price change percentage (required by model)
    features['price_change_percent'] = ((close_price - open_price) / open_price * 100) if open_price != 0 else 0
    
    # Volatility (required by model) - High-Low spread as percentage of open
    features['volatility'] = ((high_price - low_price) / open_price * 100) if open_price != 0 else 0
    
    # Moving averages (required by model)
    # Since we only have single data point, use close price
    features['moving_avg_5'] = close_price
    features['moving_avg_10'] = close_price
    
    # RSI (required by model) - Set based on price change
    # If price went up, RSI > 50, if down RSI < 50
    price_change = close_price - open_price
    if price_change > 0:
        features['rsi'] = min(70, 50 + (price_change / open_price) * 500)  # Scale up positive changes
    elif price_change < 0:
        features['rsi'] = max(30, 50 + (price_change / open_price) * 500)  # Scale down negative changes
    else:
        features['rsi'] = 50
    
    # MACD (required by model) - Approximate based on price change
    features['macd'] = price_change
    
    # Bollinger Bands (required by model)
    std_estimate = (high_price - low_price) / 4  # Rough standard deviation estimate
    features['bollinger_upper'] = close_price + 2 * std_estimate
    features['bollinger_lower'] = close_price - 2 * std_estimate
    
    # Momentum (required by model) - Price change as momentum indicator
    features['momentum'] = close_price - open_price
    
    # Average volume (required by model)
    features['avg_volume_5'] = volume
    
    return features

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict stock trend based on input features
    Expected input: {
        "open": float,
        "close": float,
        "high": float,
        "low": float,
        "volume": float
    }
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'Please place your trained model at backend/model/voting_rf_gb_svr_price_change.joblib'
            }), 500
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['open', 'close', 'high', 'low', 'volume']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Engineer features from raw OHLCV data
        engineered = engineer_features(
            float(data['open']),
            float(data['close']),
            float(data['high']),
            float(data['low']),
            float(data['volume'])
        )
        
        # Create DataFrame with all engineered features
        features_df = pd.DataFrame([engineered])
        
        # If model has specific feature names, use only those
        if hasattr(model, 'feature_names_in_'):
            # Ensure all required features exist
            for feature in model.feature_names_in_:
                if feature not in features_df.columns:
                    features_df[feature] = 0  # Default value for missing features
            # Select only the features model expects
            features_df = features_df[model.feature_names_in_]
        
        # Make prediction (regression model predicts price change)
        predicted_price_change = model.predict(features_df)[0]
        
        # Debug: Print model prediction and input features
        print("\n=== DEBUG PREDICTION ===")
        print("Input Features:")
        print(features_df.iloc[0].to_dict())
        print(f"Raw Prediction: {predicted_price_change}")
        print(f"Predicted Price Change: {predicted_price_change}")
        print("====================\n")
        
        # Calculate actual price change for comparison
        actual_price_change = float(data['close']) - float(data['open'])
        actual_price_change_pct = (actual_price_change / float(data['open'])) * 100
        
        # Convert predicted price change to trend (adjusted thresholds for better sensitivity)
        if predicted_price_change > 0.1:  # Reduced threshold from 0.5 to 0.1
            trend = 'Up'
            confidence = min(80 + abs(predicted_price_change) * 5, 99)  # Increased multiplier for faster confidence growth
        elif predicted_price_change < -0.1:  # Reduced threshold from -0.5 to -0.1
            trend = 'Down'
            confidence = min(80 + abs(predicted_price_change) * 5, 99)  # Increased multiplier for faster confidence growth
        else:
            trend = 'Neutral'
            confidence = 60 + (0.1 - abs(predicted_price_change)) * 30  # Adjusted for new threshold
        
        # Calculate volatility
        volatility = ((float(data['high']) - float(data['low'])) / float(data['open'])) * 100
        
        # Use predicted price change percentage for response
        predicted_price_change_pct = (predicted_price_change / float(data['open'])) * 100
        
        response = {
            'trend': trend,
            'confidence': round(confidence, 2),
            'price_change': round(actual_price_change, 2),
            'price_change_percentage': round(actual_price_change_pct, 2),
            'predicted_price_change': round(predicted_price_change, 2),
            'predicted_price_change_percentage': round(predicted_price_change_pct, 2),
            'volatility': round(volatility, 2),
            'input_data': {
                'open': float(data['open']),
                'close': float(data['close']),
                'high': float(data['high']),
                'low': float(data['low']),
                'volume': float(data['volume'])
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except ValueError as e:
        return jsonify({'error': 'Invalid input values', 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict trends for multiple data points
    Expected input: {
        "data": [
            {"open": float, "close": float, "high": float, "low": float, "volume": float},
            ...
        ]
    }
    """
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.get_json()
        
        if 'data' not in data or not isinstance(data['data'], list):
            return jsonify({'error': 'Invalid input format'}), 400
        
        predictions = []
        
        for item in data['data']:
            # Engineer features
            engineered = engineer_features(
                float(item['open']),
                float(item['close']),
                float(item['high']),
                float(item['low']),
                float(item['volume'])
            )
            
            features_df = pd.DataFrame([engineered])
            
            # Match model's expected features
            if hasattr(model, 'feature_names_in_'):
                for feature in model.feature_names_in_:
                    if feature not in features_df.columns:
                        features_df[feature] = 0
                features_df = features_df[model.feature_names_in_]
            
            predicted_price_change = model.predict(features_df)[0]
            
            # Convert predicted price change to trend
            if predicted_price_change > 0.5:
                trend = 'Up'
            elif predicted_price_change < -0.5:
                trend = 'Down'
            else:
                trend = 'Neutral'
            
            predictions.append({
                'trend': trend,
                'predicted_change': round(predicted_price_change, 2),
                'input': item
            })
        
        return jsonify({'predictions': predictions})
    
    except Exception as e:
        return jsonify({'error': 'Batch prediction failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
