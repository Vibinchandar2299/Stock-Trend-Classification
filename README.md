# Stock Market Trend Predictor 📈

A modern, AI-powered web application for predicting stock market trends using machine learning. Built with React, Tailwind CSS, and Flask.

## Features ✨

- **AI-Powered Predictions**: Uses trained machine learning model to predict stock trends (Up/Down/Neutral)
- **Interactive Dashboard**: Beautiful, modern UI with real-time data visualization
- **Multiple Charts**: OHLC analysis, confidence metrics, price movement, and performance radar charts
- **Prediction History**: Track and visualize your prediction history
- **Confidence Scoring**: Get confidence percentages for each prediction
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack 🛠️

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Flask** - Python web framework
- **scikit-learn** - Machine learning
- **joblib** - Model persistence
- **Flask-CORS** - Cross-origin resource sharing

## Project Structure 📁

```
Stock Market Prediction/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Python dependencies
│   └── model/
│       └── stock_model.joblib # Your trained ML model (place here)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── InputForm.js
│   │   │   ├── PredictionResult.js
│   │   │   ├── StatsCards.js
│   │   │   └── ChartsSection.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup 🚀

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Your trained model in `.joblib` format

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. **IMPORTANT**: Place your trained model file:
   - Copy your `.joblib` model file to `backend/model/stock_model.joblib`
   - Make sure the filename is exactly `stock_model.joblib`

5. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Usage 📊

1. **Start both servers** (backend on port 5000, frontend on port 3000)

2. **Input Stock Data**:
   - Opening Price
   - Closing Price
   - Highest Price
   - Lowest Price
   - Volume (number of shares traded)

3. **Click "Predict Trend"** to get:
   - Predicted trend (Up/Down/Neutral)
   - Confidence score
   - Price change analysis
   - Interactive charts and visualizations

4. **View Results**:
   - Main prediction with confidence percentage
   - OHLC bar chart
   - Confidence pie chart
   - Price movement area chart
   - Performance radar chart
   - Prediction history timeline

## API Endpoints 🔌

### Health Check
```http
GET /api/health
```

### Predict Trend
```http
POST /api/predict
Content-Type: application/json

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
  "input_data": {...},
  "timestamp": "2024-01-01T12:00:00"
}
```

### Batch Predict
```http
POST /api/batch-predict
Content-Type: application/json

{
  "data": [
    {
      "open": 150.25,
      "close": 152.80,
      "high": 153.50,
      "low": 149.90,
      "volume": 1500000
    },
    ...
  ]
}
```

## Model Requirements 📋

Your trained model should:
- Accept 5 features: [open, close, high, low, volume]
- Output predictions as: 0 (Down), 1 (Neutral), 2 (Up) or equivalent labels
- Support `predict()` method
- Optionally support `predict_proba()` for confidence scores
- Be saved using `joblib.dump()`

Example model training and saving:
```python
import joblib
from sklearn.ensemble import RandomForestClassifier

# Train your model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'stock_model.joblib')
```

## Troubleshooting 🔧

### Backend Issues

**Model not loading:**
- Ensure your model file is at `backend/model/stock_model.joblib`
- Check that the model was saved with joblib
- Verify the model is compatible with your scikit-learn version

**CORS errors:**
- Make sure Flask-CORS is installed
- Backend must be running on port 5000
- Frontend must be running on port 3000

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend server is running (`python app.py`)
- Check that backend is on `http://localhost:5000`
- Look for CORS-related errors in browser console

**Charts not displaying:**
- Ensure all npm dependencies are installed
- Check browser console for errors
- Verify recharts is properly installed

## Customization 🎨

### Changing Colors
Edit `frontend/tailwind.config.js` to customize the color scheme.

### Adding New Charts
Add new chart components in `frontend/src/components/ChartsSection.js`.

### Model Customization
Modify `backend/app.py` to adjust prediction logic and feature engineering.

## Performance Tips ⚡

- Use production build for frontend: `npm run build`
- Enable model caching in backend
- Implement rate limiting for API endpoints
- Use environment variables for configuration

## Contributing 🤝

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ using React, Tailwind CSS, and Flask**
