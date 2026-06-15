'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Calendar as CalIcon,
  Target, AlertTriangle, ArrowRightLeft, Eye,
  Users, Thermometer, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { TeamBadge } from '@/components/shared/team-badge';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import type { MatchDetail, MatchEvent } from '@/types/football';
import { cn } from '@/lib/utils';
import { TVScoreboard } from '@/components/dashboard/tv-scoreboard';

import { MatchLineups } from '@/components/dashboard/match-lineups';

function EventIcon({ type }: { type: MatchEvent['type'] }) {
  switch (type) {
    case 'goal':
      return <Target className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />;
    case 'yellow_card':
      return <div className="w-3 h-4 rounded-[2px] bg-yellow-400" />;
    case 'red_card':
      return <div className="w-3 h-4 rounded-[2px] bg-red-500" />;
    case 'substitution':
      return <ArrowRightLeft className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />;
    case 'var':
      return <Eye className="h-4 w-4 text-purple-700 dark:text-purple-400" />;
    default:
      return null;
  }
}

export default function MatchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error, refetch } = useQuery<{ data: MatchDetail }>({
    queryKey: ['match', id],
    queryFn: () => fetch(`/api/matches/${id}`).then(r => r.json()),
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(id),
  });

  const match = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <LoadingSkeleton type="hero" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState title="Match not found" description="The match you're looking for doesn't exist." />
      </div>
    );
  }

  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Back button */}
      <Link href="/fixtures">
        <Button variant="ghost" size="sm" className="text-slate-600 dark:text-white/40 hover:text-slate-900 dark:text-white gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Fixtures
        </Button>
      </Link>

      {/* Match Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-300 dark:border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 lg:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />

        {/* Group & Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {match.group && (
              <span className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80">{match.group}</span>
            )}
            <span className="text-xs text-slate-500 dark:text-white/20">•</span>
            <span className="text-xs text-slate-600 dark:text-white/40">{match.round}</span>
          </div>
          <StatusBadge status={match.status} liveMinute={match.liveMinute} />
        </div>

        {/* Teams & Score via TV Scoreboard */}
        <div className="flex justify-center py-6 lg:py-10">
          <TVScoreboard match={match} />
        </div>

        {/* Full Team Names */}
        <div className="flex items-center justify-between px-4 lg:px-12 mt-4 text-center">
          <div className="flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">{match.homeTeam.name}</h2>
          </div>
          <div className="flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">{match.awayTeam.name}</h2>
          </div>
        </div>

        {/* Match info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] text-slate-500 dark:text-white/30">
          <div className="flex items-center gap-1.5">
            <CalIcon className="h-3.5 w-3.5" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{match.venue}{match.city ? `, ${match.city}` : ''}</span>
          </div>
        </div>

        {/* Zafronix Match Facts */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] text-slate-600 dark:text-white/40">
          {match.attendance && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{match.attendance}</span>
            </div>
          )}
          {match.weather && (
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5" />
              <span>{match.weather}</span>
            </div>
          )}
          {match.referee && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{match.referee}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Events Timeline */}
        <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            Match Events
          </h3>

          {match.events && match.events.length > 0 ? (
            <div className="space-y-3">
              {match.events.map(event => (
                <div
                  key={event.id}
                  className={cn(
                    'flex items-center gap-3 py-2 px-3 rounded-lg',
                    event.team === 'home' ? 'flex-row' : 'flex-row-reverse',
                    'hover:bg-slate-100 dark:bg-white/[0.03] transition-colors'
                  )}
                >
                  <div className="text-xs text-slate-600 dark:text-white/40 font-mono w-8 text-center flex-shrink-0">
                    {event.time}&apos;
                    {event.extraTime ? `+${event.extraTime}` : ''}
                  </div>
                  <EventIcon type={event.type} />
                  <div className={event.team === 'home' ? 'text-left' : 'text-right'}>
                    <p className="text-xs font-medium text-slate-800 dark:text-white/80">{event.player}</p>
                    {event.assist && (
                      <p className="text-[10px] text-slate-500 dark:text-white/30">Assist: {event.assist}</p>
                    )}
                    {event.detail && (
                      <p className="text-[10px] text-slate-500 dark:text-white/20">{event.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events"
              description="Match events will appear here once the match starts."
            />
          )}
        </div>
        {/* Right Column: Lineups & Momentum Graph */}
        <div className="h-full w-full flex flex-col">
          {match.lineups && (
            <MatchLineups 
              lineups={match.lineups} 
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
