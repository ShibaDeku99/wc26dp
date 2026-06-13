'use client';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { Trophy, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileNav } from './mobile-nav';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#060212]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile: Logo + Menu */}
        <div className="flex items-center gap-3 lg:hidden">
          <MobileNav />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-slate-900 dark:text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">WC 2026</span>
          </div>
        </div>

        {/* Desktop: Page title area */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-white/30" />
            <Input
              placeholder="Search teams, matches..."
              className="w-[280px] pl-9 h-9 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-white/30 rounded-xl focus-visible:ring-fuchsia-500/30"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
            <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            <span className="text-[11px] font-medium text-fuchsia-700 dark:text-fuchsia-400">LIVE</span>
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
