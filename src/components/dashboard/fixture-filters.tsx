'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MatchStatus } from '@/types/football';

interface FixtureFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGroup: string;
  onGroupChange: (g: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedDate: string;
  onDateChange: (d: string) => void;
}

const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: '', label: 'All', color: 'text-slate-700 dark:text-white/60' },
  { value: 'scheduled', label: 'Scheduled', color: 'text-blue-400' },
  { value: 'live', label: 'Live', color: 'text-emerald-700 dark:text-emerald-400' },
  { value: 'finished', label: 'Finished', color: 'text-slate-400' },
  { value: 'postponed', label: 'Postponed', color: 'text-amber-700 dark:text-amber-400' },
];

const GROUP_OPTIONS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export function FixtureFilters({
  searchQuery,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
}: FixtureFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search + Date */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-white/30" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-white/30 rounded-xl"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={e => onDateChange(e.target.value)}
          className="h-10 w-full sm:w-[180px] bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white rounded-xl"
        />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500 dark:text-white/30" />
        {STATUS_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'h-8 rounded-full text-xs font-medium transition-all px-3',
              selectedStatus === opt.value
                ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20'
                : 'text-slate-600 dark:text-white/40 hover:text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:bg-white/5'
            )}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Group filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-wider mr-2">Group</span>
        {GROUP_OPTIONS.map(g => (
          <Button
            key={g || 'all'}
            variant="ghost"
            size="sm"
            onClick={() => onGroupChange(g)}
            className={cn(
              'h-7 w-7 p-0 rounded-lg text-[11px] font-bold transition-all',
              selectedGroup === g
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 dark:text-white/30 hover:text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:bg-white/5'
            )}
          >
            {g || '∀'}
          </Button>
        ))}
      </div>
    </div>
  );
}
