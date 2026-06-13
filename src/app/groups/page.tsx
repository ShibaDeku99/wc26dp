'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Users, Search } from 'lucide-react';
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
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Groups</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          12 groups with 4 teams each • Top 2 + 8 best 3rd-placed teams advance to Round of 32
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-white/30" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-white/30 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-wider mr-2">Filter</span>
          {GROUP_LETTERS.map(g => (
            <Button
              key={g || 'all'}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGroup(g)}
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

      {/* Groups Grid */}
      {isLoading ? (
        <LoadingSkeleton type="card" count={12} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGroups.map(group => (
            <GroupCard key={group.name} group={group} />
          ))}
        </div>
      )}

      {!isLoading && filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500 dark:text-white/30">No groups match your search</p>
        </div>
      )}
    </div>
  );
}
