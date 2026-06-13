'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  BarChart3,
  Radio,
  ChevronLeft,
  ChevronRight,
  LineChart,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

const NAV_ITEMS_MAP = [
  { href: '/', i18nKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/groups', i18nKey: 'nav.groups', icon: Users },
  { href: '/fixtures', i18nKey: 'nav.fixtures', icon: Calendar },
  { href: '/results', i18nKey: 'nav.results', icon: Trophy },
  { href: '/standings', i18nKey: 'nav.standings', icon: BarChart3 },
  { href: '/stats', i18nKey: 'nav.stats', icon: LineChart },
  { href: '/live', i18nKey: 'nav.live', icon: Radio },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out',
        'bg-slate-50/95 dark:bg-[#060212]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/5',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-white/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-white/5 shadow-lg shadow-fuchsia-500/10">
          <img src="https://photo2.tinhte.vn/data/attachment-files/2023/05/6433988_image.jpg" alt="World Cup Logo" className="w-full h-full object-cover scale-110" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              WC 2026
            </h1>
            <p className="text-[10px] text-slate-600 dark:text-white/40 font-medium tracking-wider uppercase">
              Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS_MAP.map(item => {
          const isActive = pathname === item.href;
          const label = t(item.i18nKey);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 shadow-lg shadow-fuchsia-500/5'
                  : 'text-slate-600 dark:text-white/50 hover:text-slate-800 dark:text-white/80 hover:bg-slate-100 dark:bg-white/5'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-fuchsia-700 dark:text-fuchsia-400')} />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-white/5">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-slate-500 dark:text-white/30 hover:text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Bottom decoration */}
      <div className="px-4 pb-4">
        {!collapsed && (
          <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/10 p-3">
            <p className="text-[10px] text-fuchsia-600/60 dark:text-fuchsia-400/60 font-medium">
              🏆 FIFA World Cup 2026
            </p>
            <p className="text-[10px] text-slate-500 dark:text-white/30 mt-1">
              USA • Mexico • Canada
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
export { NAV_ITEMS_MAP };
