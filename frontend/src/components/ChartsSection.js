import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp } from 'lucide-react';

const ChartsSection = ({ prediction, history }) => {
  // Prepare OHLC data
  const ohlcData = [
    { name: 'Open', value: prediction.input_data.open, fill: '#3b82f6' },
    { name: 'High', value: prediction.input_data.high, fill: '#10b981' },
    { name: 'Low', value: prediction.input_data.low, fill: '#ef4444' },
    { name: 'Close', value: prediction.input_data.close, fill: '#8b5cf6' },
  ];

  // Prepare trend distribution data
  const trendData = [
    { name: 'Confidence', value: prediction.confidence, fill: '#10b981' },
    { name: 'Uncertainty', value: 100 - prediction.confidence, fill: '#e5e7eb' },
  ];

  // Prepare price analysis data
  const priceAnalysis = [
    { metric: 'Open', value: prediction.input_data.open },
    { metric: 'Close', value: prediction.input_data.close },
    { metric: 'High', value: prediction.input_data.high },
    { metric: 'Low', value: prediction.input_data.low },
  ];

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Confidence',
      value: prediction.confidence,
      fullMark: 100,
    },
    {
      metric: 'Volatility',
      value: Math.min(prediction.volatility * 10, 100),
      fullMark: 100,
    },
    {
      metric: 'Price Change',
      value: Math.min(Math.abs(prediction.price_change_percentage) * 10, 100),
      fullMark: 100,
    },
    {
      metric: 'Volume Impact',
      value: Math.min((prediction.input_data.volume / 10000000) * 100, 100),
      fullMark: 100,
    },
  ];

  // Prepare history data
  const historyData = history.slice(0, 10).reverse().map((item, index) => ({
    index: index + 1,
    confidence: item.confidence,
    change: item.price_change_percentage,
    trend: item.trend === 'Up' ? 1 : item.trend === 'Down' ? -1 : 0,
  }));

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <Activity className="mr-3 text-primary-600" size={32} />
          Market Analysis & Insights
        </h2>
      </div>

      {/* First Row - OHLC Bar Chart and Confidence Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OHLC Bar Chart */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BarChart3 className="text-primary-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">OHLC Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ohlcData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {ohlcData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Pie Chart */}
        <div className="card">
          <div className="flex items-center mb-4">
            <PieChartIcon className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Prediction Confidence</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {trendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row - Line Chart and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trend Line Chart */}
        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-green-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Price Movement</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceAnalysis}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="metric" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart for Metrics */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Activity className="text-purple-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Performance Metrics</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar 
                name="Metrics" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `${value.toFixed(1)}`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Third Row - Prediction History */}
      {historyData.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <Activity className="text-orange-600 mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Prediction History</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="index" stroke="#6b7280" label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="confidence" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Confidence %"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="change" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Price Change %"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Volume and Volatility Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Trading Volume</h4>
          <p className="text-3xl font-bold text-blue-600">
            {(prediction.input_data.volume / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-gray-600 mt-2">Total shares traded</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Market Volatility</h4>
          <p className="text-3xl font-bold text-purple-600">
            {prediction.volatility.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Price fluctuation range</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Net Change</h4>
          <p className={`text-3xl font-bold ${prediction.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {prediction.price_change >= 0 ? '+' : ''}₹{prediction.price_change.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">Close vs Open price</p>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
