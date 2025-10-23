import React from 'react';
import { Activity, BarChart3, TrendingUp, IndianRupee } from 'lucide-react';

const StatsCards = ({ prediction }) => {
  const stats = [
    {
      icon: <IndianRupee className="text-primary-600" size={24} />,
      label: 'Opening Price',
      value: `₹${prediction.input_data.open.toFixed(2)}`,
      color: 'bg-primary-50',
    },
    {
      icon: <IndianRupee className="text-indigo-600" size={24} />,
      label: 'Closing Price',
      value: `₹${prediction.input_data.close.toFixed(2)}`,
      color: 'bg-indigo-50',
    },
    {
      icon: <TrendingUp className="text-green-600" size={24} />,
      label: 'Highest Price',
      value: `₹${prediction.input_data.high.toFixed(2)}`,
      color: 'bg-green-50',
    },
    {
      icon: <Activity className="text-red-600" size={24} />,
      label: 'Lowest Price',
      value: `₹${prediction.input_data.low.toFixed(2)}`,
      color: 'bg-red-50',
    },
    {
      icon: <BarChart3 className="text-purple-600" size={24} />,
      label: 'Volume',
      value: `${(prediction.input_data.volume / 1000000).toFixed(2)}M`,
      color: 'bg-purple-50',
    },
    {
      icon: <Activity className="text-orange-600" size={24} />,
      label: 'Volatility',
      value: `${prediction.volatility.toFixed(2)}%`,
      color: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card hover:scale-105 transition-transform duration-200">
          <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
            {stat.icon}
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
