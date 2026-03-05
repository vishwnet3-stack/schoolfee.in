"use client";

import React, { useState, useMemo } from 'react';
import { IoHome, IoStatsChart, IoTrendingUp, IoCard, IoChevronDown } from 'react-icons/io5';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function HomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Day');
  const [selectedDateType, setSelectedDateType] = useState('Payment Date');
  const [selectedDateRange, setSelectedDateRange] = useState('31 DEC \'25 to 28 JAN \'26');
  const [activeTab, setActiveTab] = useState('GSTIN');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showDateTypeDropdown, setShowDateTypeDropdown] = useState(false);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);

  const stats = [
    {
      icon: IoCard,
      label: 'Total Cards',
      value: '2',
      change: '+0%',
      changeType: 'neutral'
    },
    {
      icon: IoStatsChart,
      label: 'Total Spend',
      value: '₹0.00',
      change: '0%',
      changeType: 'neutral'
    },
    {
      icon: IoTrendingUp,
      label: 'Available Balance',
      value: '₹25,000.00',
      change: '100%',
      changeType: 'positive'
    }
  ];

  // Dummy chart data for different tabs
  const chartDataByTab = {
    'GSTIN': [
      { name: '31 DEC', value: 1500, label: 'GSTIN-A' },
      { name: '7 JAN', value: 2300, label: 'GSTIN-A' },
      { name: '14 JAN', value: 1800, label: 'GSTIN-B' },
      { name: '21 JAN', value: 2800, label: 'GSTIN-C' },
      { name: '28 JAN', value: 2200, label: 'GSTIN-D' },
    ],
    'COST-CENTRE': [
      { name: '31 DEC', value: 3200, label: 'Marketing' },
      { name: '7 JAN', value: 2900, label: 'Sales' },
      { name: '14 JAN', value: 3500, label: 'Operations' },
      { name: '21 JAN', value: 2600, label: 'IT' },
      { name: '28 JAN', value: 3100, label: 'HR' },
    ],
    'DEPARTMENT': [
      { name: '31 DEC', value: 2800, label: 'Engineering' },
      { name: '7 JAN', value: 3200, label: 'Design' },
      { name: '14 JAN', value: 2400, label: 'Product' },
      { name: '21 JAN', value: 3600, label: 'Marketing' },
      { name: '28 JAN', value: 2900, label: 'Sales' },
    ],
    'LOCATION': [
      { name: '31 DEC', value: 4200, label: 'Delhi' },
      { name: '7 JAN', value: 3800, label: 'Mumbai' },
      { name: '14 JAN', value: 3200, label: 'Bangalore' },
      { name: '21 JAN', value: 4600, label: 'Hyderabad' },
      { name: '28 JAN', value: 3900, label: 'Pune' },
    ],
    'VENDOR': [
      { name: '31 DEC', value: 1800, label: 'Vendor A' },
      { name: '7 JAN', value: 2400, label: 'Vendor B' },
      { name: '14 JAN', value: 2100, label: 'Vendor C' },
      { name: '21 JAN', value: 3200, label: 'Vendor D' },
      { name: '28 JAN', value: 2600, label: 'Vendor E' },
    ],
    'EXPENSE-HEAD': [
      { name: '31 DEC', value: 2200, label: 'Travel' },
      { name: '7 JAN', value: 3100, label: 'Food' },
      { name: '14 JAN', value: 1900, label: 'Accommodation' },
      { name: '21 JAN', value: 2800, label: 'Transport' },
      { name: '28 JAN', value: 3400, label: 'Entertainment' },
    ],
  };

  const periods = ['Day', 'Week', 'Month', 'Year'];
  const dateTypes = ['Invoice Date', 'Invoice Due Date', 'Approved Date', 'Payment Date'];
  const dateRanges = [
    '31 DEC \'25 to 28 JAN \'26',
    '1 JAN \'26 to 31 JAN \'26',
    '1 DEC \'25 to 31 DEC \'25',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
    'Last Month',
  ];
  const tabs = ['GSTIN', 'COST-CENTRE', 'DEPARTMENT', 'LOCATION', 'VENDOR', 'EXPENSE-HEAD'];

  // Get current chart data based on active tab
  const currentChartData = useMemo(() => {
    return chartDataByTab[activeTab as keyof typeof chartDataByTab] || chartDataByTab['GSTIN'];
  }, [activeTab]);

  // Calculate total expenses from current data
  const totalExpenses = useMemo(() => {
    return currentChartData.reduce((sum, item) => sum + item.value, 0);
  }, [currentChartData]);

  // Get Y-axis label based on active tab
  const getYAxisLabel = () => {
    switch(activeTab) {
      case 'GSTIN': return 'Gst-wise Expense';
      case 'COST-CENTRE': return 'Cost-Centre Expense';
      case 'DEPARTMENT': return 'Department-wise Expense';
      case 'LOCATION': return 'Location-wise Expense';
      case 'VENDOR': return 'Vendor-wise Expense';
      case 'EXPENSE-HEAD': return 'Expense-Head wise';
      default: return 'Expense';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#00468E] flex items-center justify-center">
          <IoHome className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <p className="text-sm text-gray-600">Welcome to CarePay Dashboard</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <stat.icon className="text-[#00468E]" size={24} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                stat.changeType === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Expense Tracking Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Period Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPeriodDropdown(!showPeriodDropdown);
                setShowDateTypeDropdown(false);
                setShowDateRangeDropdown(false);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2 bg-white min-w-[120px] justify-between"
            >
              <span className="text-sm text-gray-700">{selectedPeriod}</span>
              <IoChevronDown size={16} className="text-gray-500" />
            </button>
            {showPeriodDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowPeriodDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                  >
                    {period}
                    {selectedPeriod === period && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateTypeDropdown(!showDateTypeDropdown);
                setShowPeriodDropdown(false);
                setShowDateRangeDropdown(false);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2 bg-white min-w-[160px] justify-between"
            >
              <span className="text-sm text-gray-700">{selectedDateType}</span>
              <IoChevronDown size={16} className="text-gray-500" />
            </button>
            {showDateTypeDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {dateTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedDateType(type);
                      setShowDateTypeDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                  >
                    {type}
                    {selectedDateType === type && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateRangeDropdown(!showDateRangeDropdown);
                setShowPeriodDropdown(false);
                setShowDateTypeDropdown(false);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2 bg-white min-w-[200px] justify-between"
            >
              <span className="text-sm text-gray-700">{selectedDateRange}</span>
              <IoChevronDown size={16} className="text-gray-500" />
            </button>
            {showDateRangeDropdown && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {dateRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setShowDateRangeDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                  >
                    {range}
                    {selectedDateRange === range && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Expenses Header */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-600 mb-1">
            Total Expenses ({selectedDateRange})
          </h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>

        {/* Chart */}
        <div className="mb-6" style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                label={{ 
                  value: getYAxisLabel(),
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '12px', fill: '#6B7280' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                formatter={(value: any, name: any, props: any) => [
                  `₹${value.toLocaleString('en-IN')}`,
                  props.payload.label
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2.5}
                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table or No Data State */}
        <div className="text-center py-12">
          <p className="text-gray-900 font-medium">No Data found</p>
          <p className="text-sm text-gray-500 mt-1">Select different filters to view expense data</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <IoCard className="mx-auto mb-2 text-[#00468E]" size={24} />
            <span className="text-sm font-medium text-gray-900">Issue Card</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <IoStatsChart className="mx-auto mb-2 text-[#00468E]" size={24} />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <IoTrendingUp className="mx-auto mb-2 text-[#00468E]" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Funds</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <IoHome className="mx-auto mb-2 text-[#00468E]" size={24} />
            <span className="text-sm font-medium text-gray-900">Manage Team</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
}