'use client';

import { CalendarDays, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FixtureFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'scheduled', label: 'Sắp diễn ra' },
  { value: 'live', label: 'Trực tiếp' },
  { value: 'finished', label: 'Kết thúc' },
  { value: 'postponed', label: 'Hoãn' },
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
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/25" />
          <Input
            placeholder="Tìm đội tuyển..."
            value={searchQuery}
            onChange={event => onSearchChange(event.target.value)}
            className="h-10 rounded-xl border-slate-200 bg-white/80 pl-10 text-sm dark:border-white/[0.07] dark:bg-white/[0.035]"
          />
        </div>
        <div className="relative w-full sm:w-[190px]">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/25" />
          <Input
            type="date"
            value={selectedDate}
            onChange={event => onDateChange(event.target.value)}
            className="h-10 rounded-xl border-slate-200 bg-white/80 pl-9 text-sm dark:border-white/[0.07] dark:bg-white/[0.035]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-white/[0.05]">
        <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-white/25" />
        {STATUS_OPTIONS.map(option => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className={cn(
              'h-8 rounded-xl border px-3 text-[10px] font-bold transition-all',
              selectedStatus === option.value
                ? 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/35 dark:hover:bg-white/[0.05]'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <span className="mr-1 self-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">
          Bảng
        </span>
        {GROUP_OPTIONS.map(group => (
          <Button
            key={group || 'all'}
            variant="ghost"
            size="sm"
            onClick={() => onGroupChange(group)}
            className={cn(
              'h-8 min-w-8 shrink-0 rounded-xl border p-0 text-[10px] font-bold transition-all',
              selectedGroup === group
                ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 bg-white/50 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/35 dark:hover:bg-white/[0.05]'
            )}
          >
            {group || 'Tất cả'}
          </Button>
        ))}
      </div>
    </div>
  );
}
