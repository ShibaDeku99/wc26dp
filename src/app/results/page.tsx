'use client';

import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { MatchCard } from '@/components/dashboard/match-card';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import type { Match } from '@/types/football';

export default function ResultsPage() {
  const { data, isLoading, error, refetch } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(r => r.json()),
    staleTime: 15 * 60 * 1000,
  });

  const finishedMatches = (data?.data || [])
    .filter(m => m.status === 'finished')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const resultsByDate: Record<string, Match[]> = {};
  for (const match of finishedMatches) {
    const dateKey = new Date(match.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!resultsByDate[dateKey]) resultsByDate[dateKey] = [];
    resultsByDate[dateKey].push(match);
  }

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Results</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          {finishedMatches.length} completed match{finishedMatches.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSkeleton type="match" count={6} />
      ) : finishedMatches.length === 0 ? (
        <EmptyState
          title="No results yet"
          description="Matches haven't been played yet. Check back when the tournament starts."
          icon={<Trophy className="h-10 w-10 text-muted-foreground/50" />}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(resultsByDate).map(([date, matches]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-white/60 mb-3 flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-emerald-600/50 dark:text-emerald-400/50" />
                {date}
              </h3>
              <div className="space-y-3">
                {matches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
