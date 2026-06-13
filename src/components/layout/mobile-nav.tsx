'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Trophy } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from './sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="w-[280px] bg-gradient-to-b from-white dark:from-[#0a0f1c] to-[#0d1529] border-slate-200 dark:border-white/5 p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-white/5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-white/5">
                  <img src="https://photo2.tinhte.vn/data/attachment-files/2023/05/6433988_image.jpg" alt="World Cup Logo" className="w-full h-full object-cover scale-110" />
                </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">WC 2026</h2>
            <p className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-wider">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-white/50 hover:text-slate-800 dark:text-white/80 hover:bg-slate-100 dark:bg-white/5'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-emerald-700 dark:text-emerald-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/10 p-3">
            <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 font-medium">
              🏆 FIFA World Cup 2026
            </p>
            <p className="text-[10px] text-slate-500 dark:text-white/30 mt-1">
              USA • Mexico • Canada
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
