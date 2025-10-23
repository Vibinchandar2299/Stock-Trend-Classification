# Backend API Documentation

## Overview
Flask-based REST API for stock trend prediction using machine learning.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place your model:
   - Put your trained `.joblib` model in `model/stock_model.joblib`

4. Run server:
```bash
python app.py
```

Server runs on `http://localhost:5000`

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

### POST /api/predict
Predict stock trend from OHLCV data.

**Request:**
```json
{
  "open": 150.25,
  "close": 152.80,
  "high": 153.50,
  "low": 149.90,
  "volume": 1500000
}
```

**Response:**
```json
{
  "trend": "Up",
  "confidence": 87.5,
  "price_change": 2.55,
  "price_change_percentage": 1.70,
  "volatility": 2.16,
  "input_data": {
    "open": 150.25,
    "close": 152.80,
    "high": 153.50,
    "low": 149.90,
    "volume": 1500000
  },
  "probabilities": [0.05, 0.08, 0.87],
  "timestamp": "2024-01-01T12:00:00"
}
```

### POST /api/batch-predict
Predict trends for multiple data points.

**Request:**
```json
{
  "data": [
    {
      "open": 150.25,
      "close": 152.80,
      "high": 153.50,
      "low": 149.90,
      "volume": 1500000
    }
  ]
}
```

## Model Requirements

Your model should:
- Accept numpy array of shape (n, 5) with features: [open, close, high, low, volume]
- Have `predict()` method returning trend labels (0=Down, 1=Neutral, 2=Up)
- Optionally have `predict_proba()` for confidence scores
- Be saved with `joblib.dump(model, 'stock_model.joblib')`

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad request (invalid input)
- 500: Server error (model error, etc.)

## CORS

CORS is enabled for all origins to support frontend development.
