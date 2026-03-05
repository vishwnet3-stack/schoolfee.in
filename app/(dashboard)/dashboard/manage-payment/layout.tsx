"use client";

import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import { cn } from '@/lib/utils';
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function ManagePaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}