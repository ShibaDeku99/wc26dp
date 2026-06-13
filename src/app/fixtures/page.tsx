'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { MatchCard } from '@/components/dashboard/match-card';
import { FixtureFilters } from '@/components/dashboard/fixture-filters';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import type { Match } from '@/types/football';

export default function FixturesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(r => r.json()),
    staleTime: 15 * 60 * 1000,
  });

  const filteredFixtures = useMemo(() => {
    let fixtures = data?.data || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      fixtures = fixtures.filter(f =>
        f.homeTeam.name.toLowerCase().includes(q) ||
        f.awayTeam.name.toLowerCase().includes(q) ||
        f.homeTeam.code.toLowerCase() === q ||
        f.awayTeam.code.toLowerCase() === q
      );
    }

    if (selectedGroup) {
      fixtures = fixtures.filter(f =>
        f.group === `Group ${selectedGroup}` || f.group === selectedGroup
      );
    }

    if (selectedStatus) {
      fixtures = fixtures.filter(f => f.status === selectedStatus);
    }

    if (selectedDate) {
      fixtures = fixtures.filter(f => {
        const d = new Date(f.date);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}` === selectedDate;
      });
    }

    return fixtures;
  }, [data, searchQuery, selectedGroup, selectedStatus, selectedDate]);

  // Group fixtures by date
  const fixturesByDate = useMemo(() => {
    const grouped: Record<string, Match[]> = {};
    for (const match of filteredFixtures) {
      const dateKey = new Date(match.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(match);
    }
    return grouped;
  }, [filteredFixtures]);

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fixtures</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          Complete match schedule for FIFA World Cup 2026
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-4">
        <FixtureFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-white/30">
          {filteredFixtures.length} match{filteredFixtures.length !== 1 ? 'es' : ''} found
        </p>
      </div>

      {/* Fixtures list */}
      {isLoading ? (
        <LoadingSkeleton type="match" count={6} />
      ) : filteredFixtures.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="Try adjusting your filters to see more results."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(fixturesByDate).map(([date, matches]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-white/60 mb-3 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-600/50 dark:text-emerald-400/50" />
                {date}
                <span className="text-[10px] text-slate-500 dark:text-white/20">({matches.length} matches)</span>
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
