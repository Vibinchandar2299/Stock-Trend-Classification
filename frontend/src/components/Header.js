import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-2 rounded-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Stock Predictor</h1>
              <p className="text-sm text-gray-500">AI-Powered Market Analysis</p>
            </div>
          </div>
          
          {/* Status indicator removed */}
          <div className="flex items-center space-x-4">
            {/* Additional navigation items can be added here in the future */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
