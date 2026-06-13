'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { StandingsTable } from '@/components/dashboard/standings-table';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { Button } from '@/components/ui/button';
import { TeamBadge } from '@/components/shared/team-badge';
import { cn } from '@/lib/utils';
import type { Standing } from '@/types/football';

const GROUP_LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function StandingsPage() {
  const [selectedGroup, setSelectedGroup] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Record<string, Standing[]> }>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });

  // Fetch live matches to update standings in real-time
  const { data: todayData } = useQuery<{ data: any }>({
    queryKey: ['today'],
    queryFn: () => fetch('/api/today').then(r => r.json()),
    refetchInterval: 30000, // Poll every 30 seconds for live score changes
  });

  const baseStandings = data?.data || {};
  const groupNames = Object.keys(baseStandings).sort();
  const liveMatches = todayData?.data?.live || [];

  // Recalculate standings dynamically based on live matches
  const standings = useMemo(() => {
    if (!baseStandings || Object.keys(baseStandings).length === 0) return {};
    
    // Deep clone to avoid mutating cache
    const updatedStandings: Record<string, Standing[]> = JSON.parse(JSON.stringify(baseStandings));
    
    if (liveMatches.length === 0) return updatedStandings;

    liveMatches.forEach((match: any) => {
      // Find the group name (e.g., 'Group A')
      const matchGroup = match.group || `Group ${match.homeTeam.group}`; // Try to resolve group
      let groupKey = Object.keys(updatedStandings).find(g => g.includes(matchGroup) || matchGroup.includes(g));
      
      // Fallback: search all groups for these teams
      if (!groupKey) {
        groupKey = Object.keys(updatedStandings).find(g => 
          updatedStandings[g].some(s => s.team.id === match.homeTeam.id)
        );
      }

      if (groupKey && updatedStandings[groupKey]) {
        const group = updatedStandings[groupKey];
        const homeTeam = group.find(s => s.team.id === match.homeTeam.id);
        const awayTeam = group.find(s => s.team.id === match.awayTeam.id);

        if (homeTeam && awayTeam && match.homeScore !== null && match.awayScore !== null) {
          // Increment played matches
          homeTeam.played += 1;
          awayTeam.played += 1;

          // Update goals
          homeTeam.goalsFor += match.homeScore;
          homeTeam.goalsAgainst += match.awayScore;
          homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;

          awayTeam.goalsFor += match.awayScore;
          awayTeam.goalsAgainst += match.homeScore;
          awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;

          // Update points and W/D/L
          if (match.homeScore > match.awayScore) {
            homeTeam.won += 1;
            homeTeam.points += 3;
            awayTeam.lost += 1;
          } else if (match.homeScore < match.awayScore) {
            awayTeam.won += 1;
            awayTeam.points += 3;
            homeTeam.lost += 1;
          } else {
            homeTeam.drawn += 1;
            homeTeam.points += 1;
            awayTeam.drawn += 1;
            awayTeam.points += 1;
          }
        }
      }
    });

    // Re-sort the updated standings
    Object.keys(updatedStandings).forEach(groupName => {
      updatedStandings[groupName].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
    });

    return updatedStandings;
  }, [baseStandings, liveMatches]);

  const filteredGroups = selectedGroup
    ? groupNames.filter(g => g === `Group ${selectedGroup}`)
    : groupNames;

  const thirdPlacedTeams = useMemo(() => {
    const thirds: Standing[] = [];
    groupNames.forEach(groupName => {
      const groupStandings = standings[groupName];
      if (groupStandings && groupStandings.length >= 3) {
        // Teams are already sorted 1st to 4th
        thirds.push(groupStandings[2]);
      }
    });

    return thirds.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }, [standings, groupNames]);

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Standings</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          Group stage standings • Top 2 teams + 8 best 3rd-placed teams qualify for Round of 32
        </p>
      </div>

      {/* Group filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-slate-500 dark:text-white/30 uppercase tracking-wider mr-2">Group</span>
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

      {/* Standings Tables */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} type="table" count={4} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
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
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Ranking of 3rd-placed teams
            </h2>
            <span className="text-xs text-slate-600 dark:text-white/40">Top 8 qualify for Round of 32</span>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1021] to-cyan-950/10 overflow-hidden shadow-lg shadow-cyan-500/5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/[0.02]">
                    <th className="text-left px-2 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">#</th>
                    <th className="text-left px-2 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider">Team</th>
                    <th className="text-left px-2 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider">Grp</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">P</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">W</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">D</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">L</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7 hidden sm:table-cell">GF</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7 hidden sm:table-cell">GA</th>
                    <th className="text-center px-1 py-3 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7">GD</th>
                    <th className="text-center px-1.5 py-3 text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider w-8">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {thirdPlacedTeams.map((standing, index) => {
                    const isQualified = index < 8;
                    return (
                      <tr
                        key={standing.team.id}
                        className={cn(
                          'border-b border-slate-200 dark:border-white/[0.03] transition-colors',
                          isQualified ? 'bg-cyan-500/[0.04] hover:bg-cyan-500/[0.08]' : 'opacity-40 hover:opacity-60 bg-black/20'
                        )}
                      >
                        <td className="px-2 py-3">
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold',
                            isQualified ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20' : 'text-slate-500 dark:text-white/30 bg-slate-100 dark:bg-white/5'
                          )}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-2 py-3 w-full max-w-[120px] overflow-hidden">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={standing.team.flag}
                              alt={standing.team.name}
                              className="h-5 w-7 rounded-sm object-cover flex-shrink-0"
                            />
                            <span className="font-medium text-sm truncate">
                              {standing.team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-[11px] text-slate-600 dark:text-white/50 font-mono font-medium tracking-wider">
                          {standing.team.group}
                        </td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs">{standing.played}</td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs">{standing.won}</td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs">{standing.drawn}</td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs">{standing.lost}</td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs hidden sm:table-cell">{standing.goalsFor}</td>
                        <td className="text-center px-1 py-3 text-slate-600 dark:text-white/50 text-xs hidden sm:table-cell">{standing.goalsAgainst}</td>
                        <td className={cn(
                          'text-center px-1 py-3 text-xs font-medium',
                          standing.goalDifference > 0 ? 'text-emerald-700 dark:text-emerald-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-slate-600 dark:text-white/40'
                        )}>
                          {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                        </td>
                        <td className="text-center px-1.5 py-3 text-sm font-bold text-slate-900 dark:text-white">
                          {standing.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="px-4 py-3 border-t border-cyan-500/10 flex items-center gap-2 bg-cyan-500/[0.02]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <span className="text-[10px] text-cyan-600/80 dark:text-cyan-400/80 uppercase tracking-wider font-medium">Top 8 teams qualify for Round of 32</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
