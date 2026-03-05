"use client";

import React, { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoCard, IoChevronDown, IoArrowForward, IoSearch } from 'react-icons/io5';
import { cn } from '@/lib/utils';

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

interface IssueCardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cardData?: CardData | null;
  onSave: (card: CardData) => void;
}

const IssueCardSidebar: React.FC<IssueCardSidebarProps> = ({ isOpen, onClose, cardData, onSave }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'settings'>('transactions');
  const [cardType, setCardType] = useState<'Virtual' | 'Physical'>('Virtual');
  const [formData, setFormData] = useState({
    cardName: '',
    assignTo: '',
    limitPeriod: 'Monthly' as 'Monthly' | 'Weekly' | 'Daily' | 'One Time Limit',
    spendLimit: '',
    limitPerTransaction: '',
    transactionsAllowed: 'Not Applicable',
    cardValidityEnabled: false,
    validityYears: 5,
    atmWithdrawals: false,
    pos: false,
    ecomm: true,
    ecommLimit: 20000,
    tapToPay: false,
  });

  const [errors, setErrors] = useState({
    cardName: false,
    assignTo: false,
    limitPeriod: false,
    spendLimit: false,
  });

  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const [showTransactionLimitDropdown, setShowTransactionLimitDropdown] = useState(false);

  // Populate form if editing existing card
  useEffect(() => {
    if (cardData) {
      setCardType(cardData.type);
      setFormData({
        cardName: cardData.name,
        assignTo: cardData.employee,
        limitPeriod: cardData.limitType,
        spendLimit: cardData.totalLimit.toString(),
        limitPerTransaction: cardData.limitPerTransaction.toString(),
        transactionsAllowed: cardData.transactionsAllowed.toString(),
        cardValidityEnabled: cardData.cardValidityEnabled,
        validityYears: cardData.validityYears,
        atmWithdrawals: cardData.atmWithdrawals,
        pos: cardData.pos,
        ecomm: cardData.ecomm,
        ecommLimit: cardData.ecommLimit,
        tapToPay: cardData.tapToPay,
      });
    } else {
      // Reset form for new card
      setCardType('Virtual');
      setFormData({
        cardName: '',
        assignTo: '',
        limitPeriod: 'Monthly',
        spendLimit: '',
        limitPerTransaction: '',
        transactionsAllowed: 'Not Applicable',
        cardValidityEnabled: false,
        validityYears: 5,
        atmWithdrawals: false,
        pos: false,
        ecomm: true,
        ecommLimit: 20000,
        tapToPay: false,
      });
      setActiveTab('transactions');
    }
  }, [cardData, isOpen]);

  const limitPeriods = [
    { value: 'Monthly', label: 'Monthly', description: 'Resets on the 1st of every month at 12:00 AM IST' },
    { value: 'Weekly', label: 'Weekly', description: 'Resets every Monday at 12:00 AM IST' },
    { value: 'Daily', label: 'Daily', description: 'Resets every day at 12:00 AM IST' },
    { value: 'One Time Limit', label: 'One Time Limit', description: 'This limit does not reset and expires once used' },
  ];

  const transactionLimits = [
    'Not Applicable',
    '1', '2', '3', '4', '5', '6', '7'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardName: !formData.cardName.trim(),
      assignTo: !formData.assignTo.trim(),
      limitPeriod: !formData.limitPeriod,
      spendLimit: !formData.spendLimit || parseFloat(formData.spendLimit) <= 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCreateCard = () => {
    if (!validateForm()) {
      return;
    }

    const newCard: CardData = {
      id: cardData?.id || `card_${Date.now()}`,
      name: formData.cardName,
      cardNumber: cardData?.cardNumber || `**** ${Math.floor(1000 + Math.random() * 9000)}`,
      type: cardType,
      employee: formData.assignTo,
      email: 'vishwnet.schoolfee',
      availableLimit: parseFloat(formData.spendLimit),
      totalLimit: parseFloat(formData.spendLimit),
      limitType: formData.limitPeriod,
      limitPerTransaction: parseFloat(formData.limitPerTransaction) || 0,
      transactionsAllowed: formData.transactionsAllowed === 'Not Applicable' ? 0 : parseInt(formData.transactionsAllowed),
      lifetimeSpend: cardData?.lifetimeSpend || 0,
      status: cardData?.status || 'active',
      issuedDate: cardData?.issuedDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      validTill: cardData?.validTill || new Date(new Date().setFullYear(new Date().getFullYear() + formData.validityYears)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      cardValidityEnabled: formData.cardValidityEnabled,
      validityYears: formData.validityYears,
      atmWithdrawals: formData.atmWithdrawals,
      pos: formData.pos,
      ecomm: formData.ecomm,
      ecommLimit: formData.ecommLimit,
      tapToPay: formData.tapToPay,
    };

    onSave(newCard);
    onClose();
  };

  const handleBlockCard = () => {
    if (cardData) {
      onSave({ ...cardData, status: 'blocked' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[700px] lg:w-[800px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {cardData ? cardData.name : 'Issue New Card'}
            </h2>
            {!cardData && (
              <p className="text-sm text-gray-600 mt-1">by carepay labs</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Active Card Status (for existing cards) */}
        {cardData && cardData.status === 'active' && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-2">
            <IoCheckmarkCircle className="text-green-600" size={20} />
            <span className="text-sm text-green-800">
              This card is active and can be used for payments at authorized merchants.
            </span>
          </div>
        )}

        {/* Card Preview (for existing cards) */}
        {cardData && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Card Visual */}
              <div className="col-span-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-1">
                  <div className="bg-gradient-to-br from-[#00468E] to-[#0066CC] rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-white font-bold text-lg">Pazy</div>
                      <div className="text-right">
                        <div className="font-bold text-base">carepay labs</div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-xs opacity-90 mb-2 uppercase tracking-wide">{cardData.employee}</p>
                      <p className="text-xl font-mono tracking-[0.2em] mb-1">8175 xxxx xxxx {cardData.cardNumber.slice(-4)}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-[10px]">
                      <div>
                        <p className="opacity-80 mb-1">FROM</p>
                        <p className="font-medium">xx/xx</p>
                      </div>
                      <div>
                        <p className="opacity-80 mb-1">TO</p>
                        <p className="font-medium">xx/xx</p>
                      </div>
                      <div>
                        <p className="opacity-80 mb-1">CVV</p>
                        <p className="font-medium">xxx</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-base leading-tight">RuPay</div>
                        <div className="text-[9px] opacity-90">PREPAID</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Card Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-1">Owned By</p>
                    <p className="font-semibold text-gray-900 text-sm">{cardData.employee}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-1">Issued On</p>
                    <p className="font-medium text-gray-900 text-sm">{cardData.issuedDate}</p>
                  </div>
                  <button className="text-[#00468E] hover:text-[#003666] text-sm font-medium flex items-center gap-1">
                    View Card Details
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Available Limit */}
            <div className="mt-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-gray-600">Available Limit</span>
                <span className="text-xs text-gray-500">Total {cardData.limitType} Limit: ₹{cardData.totalLimit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <div 
                      className="bg-green-600 h-full transition-all duration-300"
                      style={{ width: `${(cardData.availableLimit / cardData.totalLimit) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                  ₹{cardData.availableLimit.toLocaleString('en-IN')}.00
                </span>
              </div>
              {cardData.limitType === 'Monthly' && (
                <div className="flex items-center gap-1 mt-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#6B7280" strokeWidth="1.5"/>
                    <path d="M7 3.5V7L9 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-xs text-gray-500">Limit resets in 3d.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs (for existing cards) */}
        {cardData && (
          <div className="border-b border-gray-200 px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={cn(
                  "pb-4 px-1 font-medium text-sm border-b-2 transition-colors",
                  activeTab === 'transactions'
                    ? "border-[#00468E] text-[#00468E]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "pb-4 px-1 font-medium text-sm border-b-2 transition-colors",
                  activeTab === 'settings'
                    ? "border-[#00468E] text-[#00468E]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                Card Settings
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-8 py-6">
          {cardData && activeTab === 'transactions' ? (
            /* Transactions Tab */
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Spend</span>
                  <span className="text-xl font-bold text-gray-900">₹{cardData.lifetimeSpend}.00</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4L4 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by Amount"
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm"
                  />
                </div>
                <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2L8 8L2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Export All (0)
                </button>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="24" rx="2" stroke="#9CA3AF" strokeWidth="2"/>
                    <path d="M8 20H40" stroke="#9CA3AF" strokeWidth="2"/>
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">You don't have any transactions yet.</p>
                <p className="text-gray-600 text-sm">Transactions made via this card will be listed here.</p>
              </div>
            </div>
          ) : cardData && activeTab === 'settings' ? (
            /* Card Settings Tab */
            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Card Controls & Limits</h4>
                  
                  {/* ATM Cash Withdrawals */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">ATM Cash Withdrawals</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.atmWithdrawals}
                        onChange={(e) => handleInputChange('atmWithdrawals', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00468E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00468E]"></div>
                    </label>
                  </div>

                  {/* POS */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">POS</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pos}
                        onChange={(e) => handleInputChange('pos', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00468E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00468E]"></div>
                    </label>
                  </div>

                  {/* EComm */}
                  <div className="py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">EComm</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ecomm}
                          onChange={(e) => handleInputChange('ecomm', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00468E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00468E]"></div>
                      </label>
                    </div>
                    {formData.ecomm && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-gray-900">₹{formData.ecommLimit.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-gray-600">Min ₹1 — Max ₹20,000</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20000"
                          value={formData.ecommLimit}
                          onChange={(e) => handleInputChange('ecommLimit', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00468E]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tap To Pay */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Tap To Pay / Contactless</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 11V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tapToPay}
                        onChange={(e) => handleInputChange('tapToPay', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00468E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00468E]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
                
                <div className="space-y-3">
                  {/* Spend Controls */}
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Spend Controls And Restrictions</p>
                      <p className="text-sm text-gray-600">Control categories & vendors for which the card can be used</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>

                  {/* Card Controls */}
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Card Controls</p>
                      <p className="text-sm text-gray-600">Configure Virtual Card Permissions</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>

                  {/* Accounting */}
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Accounting</p>
                      <p className="text-sm text-gray-600">Set presets for bill submission for your card users</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>
                </div>
              </div>

              {/* Block Card Button */}
              <button
                onClick={handleBlockCard}
                className="w-full px-4 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 5V3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Block Card
              </button>
            </div>
          ) : (
            /* Create/Edit Card Form */
            <div className="space-y-6">
              {/* Type Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Type</h3>
                <p className="text-sm text-gray-600 mb-4">Please select type of card</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCardType('Physical')}
                    disabled
                    className={cn(
                      "relative px-4 py-3 border-2 rounded-lg transition-all duration-200",
                      "border-gray-300 bg-gray-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-white flex-shrink-0" />
                      <span className="font-medium text-gray-500">Physical Card</span>
                    </div>
                    <span className="absolute top-2 right-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                      Coming Soon!
                    </span>
                  </button>
                  <button
                    onClick={() => setCardType('Virtual')}
                    className={cn(
                      "px-4 py-3 border-2 rounded-lg transition-all duration-200",
                      cardType === 'Virtual'
                        ? "border-[#00468E] bg-blue-50 shadow-sm"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        cardType === 'Virtual' ? "border-[#00468E]" : "border-gray-300"
                      )}>
                        {cardType === 'Virtual' && (
                          <div className="w-3 h-3 rounded-full bg-[#00468E]" />
                        )}
                      </div>
                      <span className={cn(
                        "font-medium transition-colors",
                        cardType === 'Virtual' ? "text-[#00468E]" : "text-gray-700"
                      )}>
                        Virtual Card
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Basic Details</h3>
                <p className="text-sm text-gray-600 mb-4">Add the card name and assign it to a user.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name your card (e.g. Team Expense Card) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Enter card name"
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm transition-all",
                        errors.cardName ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                      )}
                    />
                    {errors.cardName && (
                      <p className="text-xs text-red-500 mt-1.5">Card name is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.assignTo}
                        onChange={(e) => handleInputChange('assignTo', e.target.value)}
                        placeholder="Search Employees"
                        className={cn(
                          "w-full px-4 py-2.5 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm transition-all",
                          errors.assignTo ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        )}
                      />
                      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.assignTo && (
                      <p className="text-xs text-red-500 mt-1.5">Employee name is required</p>
                    )}
                    {/* Employee suggestion (optional) */}
                    {formData.assignTo === '' && (
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00468E] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            V
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Vishwnet India Private Limited</p>
                            <p className="text-xs text-gray-600">vishwnet.schoolfee</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Limits</h3>
                <p className="text-sm text-gray-600 mb-4">Customize limits and change them anytime</p>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Limit Period */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limit Period <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLimitDropdown(!showLimitDropdown)}
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm text-left flex items-center justify-between transition-all bg-white",
                        errors.limitPeriod ? "border-red-500 focus:ring-red-500" : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <span className={formData.limitPeriod ? "text-gray-900" : "text-gray-500"}>
                        {formData.limitPeriod || 'Select period'}
                      </span>
                      <IoChevronDown size={16} className="text-gray-400" />
                    </button>
                    {showLimitDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {limitPeriods.map((period) => (
                          <button
                            key={period.value}
                            type="button"
                            onClick={() => {
                              handleInputChange('limitPeriod', period.value as any);
                              setShowLimitDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <p className="font-medium text-gray-900 text-sm">{period.label}</p>
                            <p className="text-xs text-gray-600 mt-1">{period.description}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.limitPeriod && (
                      <p className="text-xs text-red-500 mt-1.5">Limit period is required</p>
                    )}
                  </div>

                  {/* Spend Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spend Limit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.spendLimit}
                      onChange={(e) => handleInputChange('spendLimit', e.target.value)}
                      placeholder="Enter amount"
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm transition-all",
                        errors.spendLimit ? "border-red-500 focus:ring-red-500" : "border-gray-300 hover:border-gray-400"
                      )}
                    />
                    {errors.spendLimit && (
                      <p className="text-xs text-red-500 mt-1.5">Spend limit is required</p>
                    )}
                  </div>
                </div>

                {/* Limit Per Transaction */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limit Per Transaction (Max: 2 Lacs)
                  </label>
                  <input
                    type="number"
                    value={formData.limitPerTransaction}
                    onChange={(e) => handleInputChange('limitPerTransaction', e.target.value)}
                    placeholder="Enter transaction limit"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm hover:border-gray-400 transition-all"
                  />
                </div>

                {/* Transactions Allowed */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transactions allowed without bill
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTransactionLimitDropdown(!showTransactionLimitDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm text-left flex items-center justify-between hover:border-gray-400 transition-all bg-white"
                  >
                    <span className="text-gray-900">{formData.transactionsAllowed}</span>
                    <IoChevronDown size={16} className="text-gray-400" />
                  </button>
                  {showTransactionLimitDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {transactionLimits.map((limit) => (
                        <button
                          key={limit}
                          type="button"
                          onClick={() => {
                            handleInputChange('transactionsAllowed', limit);
                            setShowTransactionLimitDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {limit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Set Card Validity */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Set Card Validity</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Control how long the card stays valid (Default: 5 years)
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cardValidityEnabled}
                      onChange={(e) => handleInputChange('cardValidityEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00468E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00468E]"></div>
                  </label>
                </div>
                {formData.cardValidityEnabled && (
                  <input
                    type="number"
                    value={formData.validityYears}
                    onChange={(e) => handleInputChange('validityYears', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00468E] text-sm"
                  />
                )}
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Additional Settings</h3>
                
                <div className="space-y-3">
                  {/* Spend Controls */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Spend Controls And Restrictions</p>
                      <p className="text-xs text-gray-600 mt-0.5">Control categories & vendors for which the card can be used</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>

                  {/* Card Controls */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Card Controls</p>
                      <p className="text-xs text-gray-600 mt-0.5">Configure Virtual Card Permissions</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>

                  {/* Accounting */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Accounting</p>
                      <p className="text-xs text-gray-600 mt-0.5">Set presets for bill submission for your card users</p>
                    </div>
                    <IoArrowForward className="text-gray-400" size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(!cardData || activeTab === 'settings') && !cardData && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 px-6 py-3 bg-[#00468E] text-white rounded-lg font-medium hover:bg-[#003666] transition-colors shadow-sm hover:shadow-md"
              >
                {cardData ? 'Save Changes' : 'Create Card'}
              </button>
            </div>
          </div>
        )}

        {/* Cancel Button for Card Details View */}
        {cardData && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default IssueCardSidebar;