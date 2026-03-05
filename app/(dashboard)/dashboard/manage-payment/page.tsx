"use client";

import React, { useState, useEffect } from 'react';
import { IoCard, IoCheckmarkCircle, IoEye, IoEyeOff, IoRefresh, IoDownload, IoFilter, IoSearch, IoCopy, IoSettings } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { IssueCardSidebar } from './components/IssueCardSidebar';
import IssueCardSidebar from './components/Issuecardsidebar';

interface CardData {
  id: string;
  name: string;
  cardNumber: string;
  type: 'Virtual' | 'Physical';
  employee: string;
  email: string;
  availableLimit: number;
  totalLimit: number;
  limitType: 'Monthly' | 'Weekly' | 'Daily' | 'One Time Limit';
  limitPerTransaction: number;
  transactionsAllowed: number;
  lifetimeSpend: number;
  status: 'active' | 'blocked';
  issuedDate: string;
  validTill: string;
  cardValidityEnabled: boolean;
  validityYears: number;
  atmWithdrawals: boolean;
  pos: boolean;
  ecomm: boolean;
  ecommLimit: number;
  tapToPay: boolean;
}

export default function CarePayCardsPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'overview'>('cards');
  const [showBalance, setShowBalance] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // Load cards from localStorage on mount
  useEffect(() => {
    const storedCards = localStorage.getItem('carepayCards');
    if (storedCards) {
      try {
        setCards(JSON.parse(storedCards));
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    }
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('carepayCards', JSON.stringify(cards));
    }
  }, [cards]);

  const handleSaveCard = (card: CardData) => {
    setCards(prevCards => {
      const existingIndex = prevCards.findIndex(c => c.id === card.id);
      if (existingIndex >= 0) {
        // Update existing card
        const updatedCards = [...prevCards];
        updatedCards[existingIndex] = card;
        return updatedCards;
      } else {
        // Add new card
        return [...prevCards, card];
      }
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(prevCards => prevCards.filter(c => c.id !== cardId));
    const storedCards = localStorage.getItem('carepayCards');
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards);
      const updatedCards = parsedCards.filter((c: CardData) => c.id !== cardId);
      localStorage.setItem('carepayCards', JSON.stringify(updatedCards));
    }
  };

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsSidebarOpen(true);
  };

  const handleNewCard = () => {
    setSelectedCard(null);
    setIsSidebarOpen(true);
  };

  const cardStats = {
    activeCards: cards.filter(c => c.status === 'active').length,
    issuedCards: cards.length
  };

  const accountDetails = {
    accountNumber: '************0568',
    ifscCode: 'UTIB0CCH274',
    balance: 0.01,
    lastUpdated: new Date().toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    })
  };

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">CarePay Cards</h1>
            <IoCheckmarkCircle className="text-green-600" size={24} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Card Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#00468E] flex items-center justify-center text-white font-semibold text-sm">
              V
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cards')}
            className={cn(
              "pb-3 px-1 font-medium text-sm border-b-2 transition-colors",
              activeTab === 'cards'
                ? "border-[#00468E] text-[#00468E]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            Cards
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "pb-3 px-1 font-medium text-sm border-b-2 transition-colors",
              activeTab === 'overview'
                ? "border-[#00468E] text-[#00468E]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            Overview
          </button>
        </div>
      </div>

      {/* Cards Tab Content */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* Issue Card & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleNewCard}
              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IoCard className="text-white" size={24} />
              </div>
              <span className="font-semibold text-green-900">Issue Card</span>
            </button>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm text-gray-600 mb-4">Active Cards</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-900">{cardStats.activeCards}</span>
                <span className="text-sm text-gray-500 mb-1">Issued: {cardStats.issuedCards}</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <IoFilter size={20} className="text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Employee, Card Name or Last 4 digits of Card Number"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] focus:border-transparent text-sm"
              />
            </div>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm">
              <option>Initiator</option>
            </select>
            <Button variant="outline" className="gap-2">
              <IoDownload size={18} />
              Export All ({cards.length})
            </Button>
          </div>

          {/* Cards Table */}
          {cards.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Card
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Card Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Available Limit
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total Limit
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Lifetime Spend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cards.map((card) => (
                      <tr 
                        key={card.id} 
                        onClick={() => handleCardClick(card)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <IoCard size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{card.name}</p>
                              <p className="text-sm text-gray-500">{card.cardNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {card.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#00468E] flex items-center justify-center text-white text-xs font-semibold">
                              {card.employee.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{card.employee}</p>
                              <p className="text-xs text-gray-500">{card.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-green-100 rounded-full h-2 overflow-hidden min-w-[60px]">
                              <div 
                                className="bg-green-600 h-full"
                                style={{ width: `${(card.availableLimit / card.totalLimit) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              ₹{card.availableLimit.toLocaleString('en-IN')}.00
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ₹{card.totalLimit.toLocaleString('en-IN')}.00
                            </p>
                            <p className="text-xs text-gray-500">{card.limitType}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">₹{card.lifetimeSpend}.00</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end">
                <span className="text-sm text-gray-600">Showing 1 - {cards.length} of {cards.length}</span>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4">
                <IoCard size={48} className="text-[#00468E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Issue your first corporate card</h3>
              <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                Start managing company expenses with smart controls
              </p>
              <Button 
                onClick={handleNewCard}
                className="bg-[#00468E] hover:bg-[#003666]"
              >
                <IoCard className="mr-2" size={18} />
                Issue Card
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Add Funds & Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl">₹</span>
              </div>
              <span className="font-semibold text-green-900">Add Funds</span>
            </button>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600">Current Available Balance</h3>
                <button className="text-[#00468E] hover:text-[#003666] text-sm font-medium flex items-center gap-1">
                  Update Now <IoRefresh size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {showBalance ? `₹${accountDetails.balance.toFixed(2)}` : '₹ •••••'}
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showBalance ? <IoEyeOff size={20} className="text-gray-600" /> : <IoEye size={20} className="text-gray-600" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Last Updated: {accountDetails.lastUpdated}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy details">
                  <IoCopy size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Settings">
                  <IoSettings size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showBalance ? <IoEyeOff size={16} className="text-gray-600" /> : <IoEye size={16} className="text-gray-600" />}
                  </button>
                  <p className="font-mono font-semibold text-gray-900">{accountDetails.accountNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
                <p className="font-mono font-semibold text-gray-900">{accountDetails.ifscCode}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <button className="pb-3 px-1 font-medium text-sm border-b-2 border-[#00468E] text-[#00468E]">
              All Transactions
            </button>
            <button className="pb-3 px-1 font-medium text-sm border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Funds History
            </button>
          </div>

          {/* Empty State or Transaction List */}
          {cards.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4">
                <IoCard size={48} className="text-[#00468E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Issue your first corporate card</h3>
              <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                Start managing company expenses with smart controls
              </p>
              <Button 
                onClick={handleNewCard}
                className="bg-[#00468E] hover:bg-[#003666]"
              >
                <IoCard className="mr-2" size={18} />
                Issue Card
              </Button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="32" height="24" rx="2" stroke="#9CA3AF" strokeWidth="2"/>
                  <path d="M8 20H40" stroke="#9CA3AF" strokeWidth="2"/>
                </svg>
              </div>
              <p className="text-gray-900 font-medium mb-1">No transactions yet</p>
              <p className="text-gray-600 text-sm">Transactions will appear here once cards are used</p>
            </div>
          )}

          {/* Export */}
          <div className="flex justify-end">
            <Button variant="outline" className="gap-2">
              <IoDownload size={18} />
              Export All (0)
            </Button>
          </div>
        </div>
      )}

      {/* Issue Card Sidebar */}
      <IssueCardSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedCard(null);
        }}
        cardData={selectedCard}
        onSave={handleSaveCard}
      />
    </div>
  );
}