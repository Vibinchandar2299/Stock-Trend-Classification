import React, { useState } from 'react';
import { Send, RotateCcw, IndianRupee, TrendingUp } from 'lucide-react';

const InputForm = ({ onPredict, loading, onReset }) => {
  const [formData, setFormData] = useState({
    open: '',
    close: '',
    high: '',
    low: '',
    volume: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    const allFilled = Object.values(formData).every(val => val !== '');
    if (!allFilled) {
      alert('Please fill all fields');
      return;
    }

    onPredict(formData);
  };

  const handleReset = () => {
    setFormData({
      open: '',
      close: '',
      high: '',
      low: '',
      volume: ''
    });
    onReset();
  };

  const handleLoadSample = () => {
    setFormData({
      open: '150.25',
      close: '152.80',
      high: '153.50',
      low: '149.90',
      volume: '1500000'
    });
  };

  return (
    <div className="card sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <IndianRupee className="mr-2 text-primary-600" size={28} />
          Input Data
        </h2>
        <button
          type="button"
          onClick={handleLoadSample}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Load Sample
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Opening Price (₹)
          </label>
          <input
            type="number"
            name="open"
            value={formData.open}
            onChange={handleChange}
            step="0.01"
            placeholder="e.g., 150.25"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Closing Price (₹)
          </label>
          <input
            type="number"
            name="close"
            value={formData.close}
            onChange={handleChange}
            step="0.01"
            placeholder="e.g., 152.80"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Highest Price (₹)
          </label>
          <input
            type="number"
            name="high"
            value={formData.high}
            onChange={handleChange}
            step="0.01"
            placeholder="e.g., 153.50"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lowest Price (₹)
          </label>
          <input
            type="number"
            name="low"
            value={formData.low}
            onChange={handleChange}
            step="0.01"
            placeholder="e.g., 149.90"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Volume (Shares)
          </label>
          <input
            type="number"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            placeholder="e.g., 1500000"
            className="input-field"
            required
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                <span>Predict Trend</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Enter real-time or historical stock data for AI-powered trend prediction
        </p>
      </div>
    </div>
  );
};

export default InputForm;
