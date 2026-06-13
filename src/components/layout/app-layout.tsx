'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060212] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-50 dark:via-[#060212] to-[#0a0514]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
      )}>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
