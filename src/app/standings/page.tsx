'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { BarChart3, Trophy } from 'lucide-react';
import { StandingsTable } from '@/components/dashboard/standings-table';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { ThirdPlaceRace } from '@/components/dashboard/third-place-race';
import { cn } from '@/lib/utils';
import type { Match, Standing } from '@/types/football';

const GROUP_LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function StandingsPage() {
  const [selectedGroup, setSelectedGroup] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Record<string, Standing[]> }>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then(r => r.json()),
    refetchInterval: 30000, // Poll every 30 seconds to get server-calculated real-time standings
  });

  const { data: fixturesData } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(r => r.json()),
    staleTime: 15 * 60 * 1000,
  });

  const standings = useMemo(() => data?.data || {}, [data?.data]);
  const groupNames = useMemo(() => Object.keys(standings).sort(), [standings]);

  const filteredGroups = selectedGroup
    ? groupNames.filter(g => g === `Group ${selectedGroup}`)
    : groupNames;

  const thirdPlacedTeams = useMemo(() => {
    const thirds: Array<{ standing: Standing; groupName: string }> = [];
    groupNames.forEach(groupName => {
      const groupStandings = standings[groupName];
      if (groupStandings && groupStandings.length >= 3) {
        thirds.push({ standing: groupStandings[2], groupName });
      }
    });

    return thirds.sort((a, b) => {
      if (b.standing.points !== a.standing.points) return b.standing.points - a.standing.points;
      if (b.standing.goalDifference !== a.standing.goalDifference) {
        return b.standing.goalDifference - a.standing.goalDifference;
      }
      return b.standing.goalsFor - a.standing.goalsFor;
    });
  }, [standings, groupNames]);

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-7 p-4 lg:p-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 px-5 py-5 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] lg:px-6">
        <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Bảng xếp hạng
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-white/40">
              Bảng xếp hạng trực tiếp và vị trí giành vé vào vòng 32 đội
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300">
            <Trophy className="h-4 w-4" />
            Hai đội đầu bảng và 8 đội hạng ba tốt nhất đi tiếp
          </div>
        </div>
      </div>

      {/* Group filter */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* Standings Tables */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} type="table" count={4} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
          {filteredGroups.map(groupName => (
            <StandingsTable
              key={groupName}
              groupName={groupName}
              standings={standings[groupName] || []}
              highlightTop={2}
            />
          ))}
        </div>
      )}

      {/* Ranking of 3rd-placed teams */}
      {!selectedGroup && thirdPlacedTeams.length > 0 && !isLoading && (
        <ThirdPlaceRace entries={thirdPlacedTeams} fixtures={fixturesData?.data || []} />
      )}
    </div>
  );
}
