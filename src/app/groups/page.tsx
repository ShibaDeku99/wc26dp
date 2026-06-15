'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Users, Search, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GroupCard } from '@/components/dashboard/group-card';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Group } from '@/types/football';

const GROUP_LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function GroupsPage() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Group[] }>({
    queryKey: ['groups'],
    queryFn: () => fetch('/api/groups').then(r => r.json()),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const filteredGroups = useMemo(() => {
    let groups = data?.data || [];

    if (selectedGroup) {
      groups = groups.filter(g => g.name === `Group ${selectedGroup}`);
    }

    if (search) {
      const query = search.toLowerCase();
      groups = groups.filter(g =>
        g.teams.some(t =>
          t.name.toLowerCase().includes(query) ||
          t.code.toLowerCase().includes(query)
        )
      );
    }

    return groups;
  }, [data, selectedGroup, search]);

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-7 p-4 lg:p-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 px-5 py-5 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] lg:px-6">
        <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Các bảng đấu
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-white/40">
              Khám phá 12 bảng đấu và 48 đội tuyển tại FIFA World Cup 2026
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300">
            <Trophy className="h-4 w-4" />
            Hai đội đầu bảng và 8 đội hạng ba tốt nhất đi tiếp
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/50 p-3 backdrop-blur-lg dark:border-white/[0.06] dark:bg-white/[0.015] xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/30" />
          <Input
            placeholder="Tìm đội tuyển..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 rounded-xl border-slate-200 bg-white/80 pl-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/15 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/25"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/30">
            Bảng
          </span>
          {GROUP_LETTERS.map(g => (
            <Button
              key={g || 'all'}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGroup(g)}
              className={cn(
                'h-8 min-w-8 rounded-xl border px-2 text-[11px] font-bold transition-all',
                selectedGroup === g
                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 shadow-[0_0_18px_rgba(16,185,129,0.1)] dark:text-emerald-300'
                  : 'border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35 dark:hover:bg-white/[0.06] dark:hover:text-white/70'
              )}
            >
              {g || 'Tất cả'}
            </Button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <LoadingSkeleton type="card" count={12} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredGroups.map(group => (
            <GroupCard key={group.name} group={group} />
          ))}
        </div>
      )}

      {!isLoading && filteredGroups.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 py-14 text-center dark:border-white/10 dark:bg-white/[0.015]">
          <Search className="mx-auto mb-3 h-6 w-6 text-slate-300 dark:text-white/20" />
          <p className="text-sm font-medium text-slate-500 dark:text-white/35">Không tìm thấy bảng đấu phù hợp</p>
        </div>
      )}
    </div>
  );
}
