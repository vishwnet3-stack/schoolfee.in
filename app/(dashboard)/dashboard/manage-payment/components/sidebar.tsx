"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IoCard,
  IoHome,
  IoPeople,
  IoReceipt,
  IoChevronDown,
  IoChevronForward,
  IoSettings,
  IoHelpCircle,
  IoMenu,
  IoClose,
  IoLogOut
} from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const [expenseOpen, setExpenseOpen] = useState(true);

  const menuItems = [
    { icon: IoCard, label: 'CarePay Cards', href: '/dashboard/manage-payment' },
    { icon: IoHome, label: 'Home', href: '/dashboard/manage-payment/pages/home' },
    { icon: IoPeople, label: 'Schools', href: '/dashboard/manage-payment/pages/vendors' },
  ];

  const expenseSubItems = [
    { label: 'Overview', href: '/dashboard/manage-payment/pages/expense/overview' },
    { label: 'For Approval', href: '/dashboard/manage-payment/pages/expense/approval' },
    { label: 'History', href: '/dashboard/manage-payment/pages/expense/history' },
  ];

  const bottomSectionItems = [
    { icon: IoPeople, label: 'People', href: '/dashboard/manage-payment/pages/people' },
    { icon: IoSettings, label: 'Settings', href: '/dashboard/manage-payment/pages/settings' },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00468E] to-[#0066CC] flex items-center justify-center text-white font-bold text-sm">
                SF
              </div>
              <span className="font-semibold text-gray-800">SchoolFee</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <IoMenu size={20} /> : <IoClose size={20} />}
          </button>
        </div>

        {/* Company Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00468E] flex items-center justify-center text-white font-bold">
                V
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">Vishwnet India</p>
                <p className="text-xs text-gray-500 truncate">Vishwnet India Private Limited</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#00468E] text-white"
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}

            {/* Expense Dropdown */}
            <div>
              <button
                onClick={() => !isCollapsed && setExpenseOpen(!expenseOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  pathname.includes('/expense')
                    ? "text-[#00468E] bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
              >
                <IoReceipt size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">Expense</span>
                    {expenseOpen ? (
                      <IoChevronDown size={16} />
                    ) : (
                      <IoChevronForward size={16} />
                    )}
                  </>
                )}
              </button>

              {!isCollapsed && expenseOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {expenseSubItems.map((subItem) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "block px-4 py-2 text-sm rounded-lg transition-colors",
                          isActive
                            ? "text-[#00468E] bg-blue-50 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Section Items (People, Settings, Help) */}
            {bottomSectionItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#00468E] text-white"
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={() => {
              // Add your logout logic here
              console.log('Logout clicked');
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "text-red-600 hover:bg-red-50",
              isCollapsed && "justify-center"
            )}
          >
            <IoLogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;