import React from 'react';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';

const PredictionResult = ({ prediction }) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Up':
        return <TrendingUp className="text-green-500" size={48} />;
      case 'Down':
        return <TrendingDown className="text-red-500" size={48} />;
      default:
        return <Minus className="text-yellow-500" size={48} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'Up':
        return 'from-green-500 to-emerald-600';
      case 'Down':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-yellow-500 to-orange-600';
    }
  };

  const getTrendBg = (trend) => {
    switch (trend) {
      case 'Up':
        return 'bg-green-50 border-green-200';
      case 'Down':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className={`card border-2 ${getTrendBg(prediction.trend)}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prediction Result</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Award size={16} />
          <span>AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Display */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getTrendColor(prediction.trend)} p-1 mb-4`}>
            <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
              {getTrendIcon(prediction.trend)}
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {prediction.trend}
          </h3>
          <p className="text-gray-600">Predicted Trend</p>
        </div>

        {/* Confidence Display */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - prediction.confidence / 100)}`}
                className={`${
                  prediction.trend === 'Up'
                    ? 'text-green-500'
                    : prediction.trend === 'Down'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {prediction.confidence}%
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Confidence Score
          </h3>
          <p className="text-gray-600">Model Certainty</p>
        </div>
      </div>

      {/* Price Change */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Price Change</p>
            <p className={`text-2xl font-bold ${
              prediction.price_change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {prediction.price_change >= 0 ? '+' : ''}₹{prediction.price_change}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Change %</p>
            <p className={`text-2xl font-bold ${
              prediction.price_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {prediction.price_change_percentage >= 0 ? '+' : ''}{prediction.price_change_percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
