'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Goal,
  Medal,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { TVScoreboard } from '@/components/dashboard/tv-scoreboard';
import { cn } from '@/lib/utils';
import { getGroupColor } from '@/lib/group-colors';
import type { Match } from '@/types/football';

const GROUPS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function scoreFor(match: Match, side: 'home' | 'away') {
  return side === 'home' ? match.homeScore ?? 0 : match.awayScore ?? 0;
}

function ResultCard({ match }: { match: Match }) {
  const groupColors = getGroupColor(match.group ?? '');

  return (
    <Link
      href={`/matches/${match.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl border bg-white/75 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/[0.025]',
        match.group ? groupColors.border : 'border-slate-200 dark:border-white/[0.06]',
        match.group && groupColors.hoverBorder
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className={cn('text-[9px] font-black uppercase tracking-wider', groupColors.text)}>
              {match.group}
            </span>
          )}
          <span className="text-[9px] text-slate-400 dark:text-white/25">/</span>
          <span className="text-[9px] text-slate-500 dark:text-white/35">{match.round}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white/35">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
          Full time
        </span>
      </div>

      <div className="overflow-x-auto px-2 py-3 no-scrollbar sm:px-4">
        <div className="mx-auto min-w-[430px]">
          <TVScoreboard match={match} compact />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[9px] text-slate-400 dark:border-white/[0.05] dark:text-white/25">
        <span className="truncate">{match.venue}</span>
        <span className="flex shrink-0 items-center gap-1 font-semibold text-emerald-700 transition group-hover:gap-1.5 dark:text-emerald-400">
          Chi tiết trận đấu <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export default function ResultsPage() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRound, setSelectedRound] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(response => response.json()),
    staleTime: 15 * 60 * 1000,
  });

  const finishedMatches = useMemo(
    () =>
      (data?.data ?? [])
        .filter(match => match.status === 'finished')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data?.data]
  );

  const rounds = useMemo(
    () => Array.from(new Set(finishedMatches.map(match => match.round))).filter(Boolean),
    [finishedMatches]
  );

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    return finishedMatches.filter(match => {
      const matchesSearch =
        !query ||
        match.homeTeam.name.toLowerCase().includes(query) ||
        match.awayTeam.name.toLowerCase().includes(query) ||
        match.homeTeam.code.toLowerCase().includes(query) ||
        match.awayTeam.code.toLowerCase().includes(query);
      const matchesGroup =
        !selectedGroup ||
        match.group === selectedGroup ||
        match.group === `Group ${selectedGroup}`;
      const matchesRound = !selectedRound || match.round === selectedRound;
      return matchesSearch && matchesGroup && matchesRound;
    });
  }, [finishedMatches, search, selectedGroup, selectedRound]);

  const resultsByDate = useMemo(() => {
    const grouped = new Map<string, { label: string; shortLabel: string; matches: Match[] }>();
    filteredMatches.forEach(match => {
      const date = new Date(match.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          shortLabel: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          matches: [],
        });
      }
      grouped.get(key)?.matches.push(match);
    });
    return Array.from(grouped.values());
  }, [filteredMatches]);

  const summary = useMemo(() => {
    const totalGoals = finishedMatches.reduce(
      (total, match) => total + scoreFor(match, 'home') + scoreFor(match, 'away'),
      0
    );
    const draws = finishedMatches.filter(
      match => scoreFor(match, 'home') === scoreFor(match, 'away')
    ).length;
    const biggestWin = finishedMatches.reduce(
      (largest, match) => {
        const margin = Math.abs(scoreFor(match, 'home') - scoreFor(match, 'away'));
        return margin > largest.margin ? { match, margin } : largest;
      },
      { match: undefined as Match | undefined, margin: -1 }
    ).match;

    return {
      totalGoals,
      draws,
      average: finishedMatches.length ? (totalGoals / finishedMatches.length).toFixed(1) : '0.0',
      biggestWin,
    };
  }, [finishedMatches]);

  const hasFilters = Boolean(search || selectedGroup || selectedRound);
  const clearFilters = () => {
    setSearch('');
    setSelectedGroup('');
    setSelectedRound('');
  };

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/10 dark:border-white/[0.07] lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(139,92,246,0.2),transparent_30%),radial-gradient(circle_at_15%_100%,rgba(16,185,129,0.18),transparent_38%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Kho lưu trữ kết quả
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <Trophy className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-0.04em] lg:text-4xl">Kết quả trận đấu</h1>
                <p className="mt-1 text-sm text-white/45">
                  Toàn bộ tỷ số chung cuộc, được nhóm theo ngày và vòng đấu.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              [finishedMatches.length, 'Đã đấu'],
              [summary.totalGoals, 'Bàn thắng'],
              [summary.average, 'Bàn/trận'],
            ].map(([value, label]) => (
              <div key={label} className="min-w-[78px] rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5 text-center backdrop-blur-xl">
                <p className="text-lg font-black">{value}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Đã hoàn tất', value: finishedMatches.length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Tổng bàn thắng', value: summary.totalGoals, icon: Goal, color: 'amber' },
          { label: 'Trận hòa', value: summary.draws, icon: Activity, color: 'cyan' },
          {
            label: 'Thắng đậm nhất',
            value: summary.biggestWin
              ? `${Math.max(scoreFor(summary.biggestWin, 'home'), scoreFor(summary.biggestWin, 'away'))}-${Math.min(scoreFor(summary.biggestWin, 'home'), scoreFor(summary.biggestWin, 'away'))}`
              : '-',
            icon: Medal,
            color: 'violet',
          },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{item.value}</p>
              </div>
              <div className={cn(
                'rounded-xl border p-2.5',
                item.color === 'emerald' && 'border-emerald-500/15 bg-emerald-500/10 text-emerald-500',
                item.color === 'amber' && 'border-amber-500/15 bg-amber-500/10 text-amber-500',
                item.color === 'cyan' && 'border-cyan-500/15 bg-cyan-500/10 text-cyan-500',
                item.color === 'violet' && 'border-violet-500/15 bg-violet-500/10 text-violet-500'
              )}>
                <item.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/60 p-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/25" />
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Tìm đội tuyển..."
              className="h-10 rounded-xl border-slate-200 bg-white/80 pl-10 text-sm dark:border-white/[0.07] dark:bg-white/[0.035]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar xl:ml-auto">
            {GROUPS.map(group => (
              <button
                key={group || 'all'}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={cn(
                  'h-9 min-w-9 shrink-0 rounded-xl border px-2 text-[10px] font-bold transition',
                  selectedGroup === group
                    ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 bg-white/60 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35 dark:hover:bg-white/[0.05]'
                )}
              >
                {group || 'Tất cả'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-white/[0.05]">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">Vòng đấu</span>
          <button
            type="button"
            onClick={() => setSelectedRound('')}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-[9px] font-bold transition',
              !selectedRound
                ? 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                : 'border-slate-200 text-slate-500 dark:border-white/[0.06] dark:text-white/35'
            )}
          >
            Tất cả vòng
          </button>
          {rounds.map(round => (
            <button
              key={round}
              type="button"
              onClick={() => setSelectedRound(round)}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-[9px] font-bold transition',
                selectedRound === round
                  ? 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:text-white/35 dark:hover:bg-white/[0.04]'
              )}
            >
              {round}
            </button>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-rose-500 dark:text-white/35"
            >
              <RotateCcw className="h-3 w-3" />
              Đặt lại
            </button>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-white/35">
          Đang hiển thị <span className="font-bold text-slate-900 dark:text-white">{filteredMatches.length}</span> kết quả
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-white/25">
          <CalendarDays className="h-3.5 w-3.5" />
          Mới nhất trước
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="match" count={6} />
      ) : finishedMatches.length === 0 ? (
        <EmptyState
          title="Chưa có kết quả"
          description="Các trận đã kết thúc sẽ xuất hiện tại đây."
          icon={<Trophy className="h-10 w-10 text-muted-foreground/50" />}
        />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          title="Không tìm thấy kết quả"
          description="Hãy thử thay đổi đội tuyển, bảng hoặc vòng đấu."
          icon={<Search className="h-10 w-10 text-muted-foreground/50" />}
        />
      ) : (
        <div className="space-y-7">
          {resultsByDate.map(day => (
            <section key={day.label}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 min-w-12 flex-col items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/[0.07] text-violet-700 dark:text-violet-300">
                  <span className="text-[9px] font-bold uppercase tracking-wider">{day.shortLabel.split(' ')[0]}</span>
                  <span className="text-sm font-black">{day.shortLabel.split(' ')[1]}</span>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">{day.label}</h2>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-white/30">
                    {day.matches.length} trận đã kết thúc
                  </p>
                </div>
                <div className="ml-2 h-px flex-1 bg-slate-200 dark:bg-white/[0.06]" />
              </div>
              <div className="grid gap-3 2xl:grid-cols-2">
                {day.matches.map(match => <ResultCard key={match.id} match={match} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
