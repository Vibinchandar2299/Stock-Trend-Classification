import React, { useState } from 'react';
import { TrendingUp, Activity, BarChart3, AlertCircle } from 'lucide-react';
import InputForm from './components/InputForm';
import PredictionResult from './components/PredictionResult';
import ChartsSection from './components/ChartsSection';
import Header from './components/Header';
import StatsCards from './components/StatsCards';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Please check your backend server.');
      }

      const data = await response.json();
      setPrediction(data);
      
      // Add to history (keep last 10)
      setHistory(prev => [data, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.message);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Stock Trend Predictor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by AI to predict market trends based on key trading indicators
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slide-up">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Input Form Section */}
          <div className="lg:col-span-1">
            <InputForm onPredict={handlePredict} loading={loading} onReset={handleReset} />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {prediction ? (
              <div className="space-y-6 animate-slide-up">
                <PredictionResult prediction={prediction} />
                <StatsCards prediction={prediction} />
              </div>
            ) : (
              <div className="card h-full flex items-center justify-center text-center p-12">
                <div>
                  <Activity className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                    No Prediction Yet
                  </h3>
                  <p className="text-gray-400">
                    Enter stock data and click "Predict Trend" to see results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {prediction && (
          <div className="animate-slide-up">
            <ChartsSection prediction={prediction} history={history} />
          </div>
        )}

        {/* Features Section */}
        {!prediction && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Predictions</h3>
              <p className="text-gray-600">
                Advanced machine learning model trained on historical stock data
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
              <p className="text-gray-600">
                Interactive charts and graphs for better market understanding
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
              <p className="text-gray-600">
                Get instant predictions with confidence scores and insights
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-12">
        <p>© 2024 Stock Trend Predictor. Built with React, Tailwind CSS & Flask.</p>
      </footer>
    </div>
  );
}

export default App;
