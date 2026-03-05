'use client';

import React, { useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiSettings
} from 'react-icons/fi';
import { BsShieldCheck } from 'react-icons/bs';
import { BiRupee } from 'react-icons/bi';

interface Card {
  id: string;
  name: string;
  number: string;
  type: 'Virtual' | 'Physical';
  employee: {
    name: string;
    email: string;
  };
  availableLimit: number;
  totalLimit: number;
  frequency: string;
  lifetimeSpend: number;
}

const CorporateCardsPage = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'overview'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  // Mock data
  const cards: Card[] = [
    {
      id: '1',
      name: 'DSC',
      number: '**** 5280',
      type: 'Virtual',
      employee: {
        name: 'Vishwnet India Private Limit...',
        email: 'vishwnet.schoolfee'
      },
      availableLimit: 20000,
      totalLimit: 20000,
      frequency: 'Monthly',
      lifetimeSpend: 0
    },
    {
      id: '2',
      name: 'DSC Payment',
      number: '**** 8887',
      type: 'Virtual',
      employee: {
        name: 'Vishwnet India Private Limit...',
        email: 'vishwnet.schoolfee'
      },
      availableLimit: 5000,
      totalLimit: 5000,
      frequency: 'Monthly',
      lifetimeSpend: 0
    }
  ];

  const accountBalance = 0.01;
  const accountNumber = '**********0568';
  const ifscCode = 'UTIBOCCH274';

  return (
    <div className="space-y-3 pl-70">
      {/* Header Section */}
      {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Banking</h2>
        </div>
      </div> */}

      {/* Title with Shield */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Corporate Cards</h1>
        <BsShieldCheck className="w-6 h-6 text-green-600" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('cards')}
            className={`pb-3 px-1 font-medium text-sm lg:text-base transition-colors relative ${activeTab === 'cards'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Cards
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium text-sm lg:text-base transition-colors relative ${activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Overview
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'cards' ? (
        <>
          {/* Issue Card and Active Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Issue Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 lg:p-8 border border-green-200">
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[160px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <FiCreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Issue Card</h3>
              </div>
            </div>

            {/* Active Cards */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">Active Cards</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">2</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Issued: 2</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-xl">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Employee, Card Name or Last 4 digits of Card Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Filter Button */}
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FiFilter className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Filter</span>
              </button>

              {/* Initiator Dropdown */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                <option>Initiator</option>
                <option>All</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300">
              <FiDownload className="w-4 h-4" />
              <span className="text-sm font-medium">Export All (2)</span>
            </button>
          </div>

          {/* Cards Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Card
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Card Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Available Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Total Limit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Lifetime Spend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FiCreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{card.name}</div>
                            <div className="text-sm text-gray-500">{card.number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {card.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-xs">V</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{card.employee.name}</div>
                            <div className="text-xs text-gray-500">{card.employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <BiRupee className="w-4 h-4" />
                            <span className="font-medium">{card.availableLimit.toLocaleString()}.00</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(card.availableLimit / card.totalLimit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1">
                            <BiRupee className="w-4 h-4" />
                            <span className="font-medium">{card.totalLimit.toLocaleString()}.00</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{card.frequency}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <BiRupee className="w-4 h-4" />
                          <span className="font-medium">{card.lifetimeSpend.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
              <span className="text-sm text-gray-600">Showing 1 - 2 of 2</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Overview Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Add Funds Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 lg:p-8 border border-green-200">
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[160px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                  <BiRupee className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Add Funds</h3>
              </div>
            </div>

            {/* Current Available Balance */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-600">Current Available Balance</h3>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                  Update Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <BiRupee className="w-6 h-6" />
                <span className="text-4xl font-bold text-gray-900">{accountBalance.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">Last Updated: 27 Jan, 2026 4:03 PM</p>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-900">Account Details</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <FiCopy className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <FiSettings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {showAccountNumber ? '1234567890568' : accountNumber}
                    </span>
                    <button
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {showAccountNumber ? (
                        <FiEyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">IFSC Code</p>
                  <p className="font-medium text-gray-900">{ifscCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for All Transactions and Funds History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                <button className="pb-3 px-1 font-medium text-sm text-green-600 border-b-2 border-green-600">
                  All Transactions
                </button>
                <button className="pb-3 px-1 font-medium text-sm text-gray-600 hover:text-gray-900">
                  Funds History
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Employee, Amount, Ref.No, Card Name or Last 4 digits of Card Number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiFilter className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Filter</span>
                </button>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                  <option>Initiator</option>
                </select>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300">
                <FiDownload className="w-4 h-4" />
                <span className="text-sm font-medium">Export All (0)</span>
              </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-48 h-48 mb-6">
                <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <FiCreditCard className="w-24 h-24 text-green-600" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Issue your first corporate card</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Start managing company expenses with smart controls
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <FiCreditCard className="w-5 h-5" />
                Issue Card
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Showing 1 - 0 of 0</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CorporateCardsPage;