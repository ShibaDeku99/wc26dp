'use client';

import { useState } from 'react';
import type { MatchStatsPeriod } from '@/types/football';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface Props {
  periods: MatchStatsPeriod[];
}

export function MatchStatisticsTabbed({ periods }: Props) {
  const [activePeriod, setActivePeriod] = useState<string>('Full Time');

  if (!periods || periods.length === 0) return null;

  const currentPeriod = periods.find(p => p.period === activePeriod) || periods[0];
  
  // Group statistics by category
  const groupedStats = currentPeriod.statistics.reduce((acc, stat) => {
    const cat = stat.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(stat);
    return acc;
  }, {} as Record<string, typeof currentPeriod.statistics>);

  return (
    <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          Match Statistics
        </h3>
        
        <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-1">
          {periods.map(p => (
            <button
              key={p.period}
              onClick={() => setActivePeriod(p.period)}
              className={cn(
                "px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all",
                activePeriod === p.period 
                  ? "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-600 dark:text-white/40 hover:text-slate-700 dark:text-white/70"
              )}
            >
              {p.period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedStats).map(([category, stats]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest text-center border-b border-slate-200 dark:border-white/5 pb-2 col-span-full">
              {category}
            </h4>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-5 mt-4">
              {stats.map((stat, i) => {
                const homeNum = stat.homeValue ?? (typeof stat.home === 'string' ? parseFloat(stat.home) || 0 : stat.home);
                const awayNum = stat.awayValue ?? (typeof stat.away === 'string' ? parseFloat(stat.away) || 0 : stat.away);
                
                const total = homeNum + awayNum;
                // If total is 0 (e.g. 0 Big chances to 0), both bars should be 0% width.
                const homePercent = total > 0 ? (homeNum / total) * 100 : 0;
                const awayPercent = total > 0 ? (awayNum / total) * 100 : 0;

                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-white/70 font-medium">{stat.home}</span>
                      <span className="text-slate-600 dark:text-white/40 text-[10px] uppercase tracking-wider text-center">{stat.label}</span>
                      <span className="text-slate-700 dark:text-white/70 font-medium">{stat.away}</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      <div className="flex-1 bg-slate-100 dark:bg-white/5 rounded-l-full overflow-hidden flex justify-end">
                        <div
                          className={cn(
                            "h-full rounded-l-full transition-all duration-500",
                            homeNum >= awayNum && total > 0 ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/20"
                          )}
                          style={{ width: `${homePercent}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-slate-100 dark:bg-white/5 rounded-r-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-r-full transition-all duration-500",
                            awayNum >= homeNum && total > 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-white/20"
                          )}
                          style={{ width: `${awayPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
