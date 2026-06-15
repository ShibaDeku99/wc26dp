'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { MatchCard } from '@/components/dashboard/match-card';
import { NextMatchCountdown } from '@/components/dashboard/next-match-countdown';
import { TournamentSidebar } from '@/components/dashboard/tournament-sidebar';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { cn } from '@/lib/utils';
import type { Match, TodayData } from '@/types/football';

function localDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

const QUICK_LINKS = [
  { href: '/groups', label: 'Khám phá vòng bảng', icon: Users },
  { href: '/standings', label: 'Bảng xếp hạng trực tiếp', icon: BarChart3 },
  { href: '/bracket', label: 'Sơ đồ vòng loại trực tiếp', icon: Trophy },
];

const EMPTY_MATCHES: Match[] = [];

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('');

  const { data: todayData, isLoading: todayLoading, refetch: refetchToday } = useQuery<{
    data: TodayData;
  }>({
    queryKey: ['today'],
    queryFn: () => fetch('/api/today').then(response => response.json()),
    staleTime: 5 * 60 * 1000,
  });

  const { data: fixturesData, isLoading: fixturesLoading } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(response => response.json()),
    staleTime: 15 * 60 * 1000,
  });

  const allMatches = useMemo(() => fixturesData?.data ?? [], [fixturesData?.data]);
  const today = todayData?.data;
  const upcoming = today?.upcoming ?? EMPTY_MATCHES;
  const liveMatches = today?.live ?? EMPTY_MATCHES;
  const finishedMatches = today?.finished ?? EMPTY_MATCHES;

  const matchesPlayed = allMatches.filter(match => match.status === 'finished').length;
  const liveCount = allMatches.filter(match => match.status === 'live').length;
  const progress = Math.min(100, Math.round((matchesPlayed / 104) * 100));

  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    allMatches.forEach(match => {
      if (!match.homeTeam.name.includes('TBD')) teams.add(match.homeTeam.id);
      if (!match.awayTeam.name.includes('TBD')) teams.add(match.awayTeam.id);
    });
    return teams.size || 48;
  }, [allMatches]);

  const nextAbsoluteMatch = useMemo(
    () =>
      [...upcoming].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0] ?? null,
    [upcoming]
  );

  const upcomingDates = useMemo(
    () => Array.from(new Set(upcoming.map(match => localDateKey(match.date)))).sort(),
    [upcoming]
  );

  const activeDate = selectedDate || upcomingDates[0] || '';
  const filteredUpcoming = useMemo(
    () => upcoming.filter(match => localDateKey(match.date) === activeDate),
    [upcoming, activeDate]
  );

  const stats = [
    {
      label: 'Đội tuyển',
      value: fixturesLoading ? '--' : uniqueTeams,
      detail: 'Thi đấu tại 12 bảng',
      icon: Users,
      accent: 'emerald',
    },
    {
      label: 'Tổng số trận',
      value: Math.max(104, allMatches.length),
      detail: '72 trận vòng bảng + 32 trận loại trực tiếp',
      icon: CalendarDays,
      accent: 'cyan',
    },
    {
      label: 'Đã thi đấu',
      value: matchesPlayed,
      detail: `Hoàn thành ${progress}%`,
      icon: CheckCircle2,
      accent: 'violet',
    },
    {
      label: 'Đang trực tiếp',
      value: liveCount,
      detail: liveCount ? 'Theo dõi từng khoảnh khắc' : 'Đang chờ trận tiếp theo',
      icon: Radio,
      accent: 'rose',
    },
  ] as const;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/10 dark:border-white/[0.07] lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_65%_100%,rgba(16,185,129,0.16),transparent_35%)]" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/[0.08]" />

        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              FIFA World Cup 2026
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Trung tâm điều hành
              <span className="block text-emerald-300">giải đấu của bạn.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 lg:text-base">
              Tỷ số trực tiếp, cuộc đua giành vé, lịch thi đấu và mọi diễn biến quan trọng
              tại Hoa Kỳ, Mexico và Canada.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-white/70 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
                >
                  <link.icon className="h-4 w-4 text-emerald-300" />
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  Tiến độ giải đấu
                </p>
                <p className="mt-1 text-2xl font-black">{matchesPlayed} / 104</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-emerald-400/20 text-sm font-black text-emerald-300">
                {progress}%
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-white/35">
              <span>Vòng bảng</span>
              <span>Chung kết / 19 tháng 7</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(item => {
          const accentStyles = {
            emerald: 'border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
            cyan: 'border-cyan-500/15 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
            violet: 'border-violet-500/15 bg-violet-500/10 text-violet-600 dark:text-violet-300',
            rose: 'border-rose-500/15 bg-rose-500/10 text-rose-600 dark:text-rose-300',
          };

          return (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.025] lg:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                </div>
                <div className={cn('rounded-xl border p-2.5', accentStyles[item.accent])}>
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 dark:text-white/35">{item.detail}</p>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <main className="min-w-0 space-y-7">
          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {liveMatches.length > 0 ? (
                    <Radio className="h-4 w-4 animate-pulse text-rose-500" />
                  ) : (
                    <Clock3 className="h-4 w-4 text-emerald-500" />
                  )}
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {liveMatches.length > 0 ? 'Trận đang diễn ra' : 'Trận tiếp theo'}
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/35">
                  {liveMatches.length > 0
                    ? `${liveMatches.length} trận đang diễn ra`
                    : 'Trận đấu sắp bắt đầu gần nhất'}
                </p>
              </div>
              <Link
                href="/fixtures"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-500 dark:text-emerald-400"
              >
                Tất cả lịch đấu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {todayLoading ? (
              <LoadingSkeleton type="match" count={1} />
            ) : liveMatches.length > 0 ? (
              <div className="space-y-3">
                {liveMatches.map(match => <MatchCard key={match.id} match={match} />)}
              </div>
            ) : nextAbsoluteMatch ? (
              <NextMatchCountdown nextMatch={nextAbsoluteMatch} onLive={() => refetchToday()} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center dark:border-white/10 dark:bg-white/[0.015]">
                <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-slate-300 dark:text-white/20" />
                <p className="text-sm text-slate-500 dark:text-white/35">Chưa có trận đấu nào được lên lịch.</p>
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-cyan-500" />
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">Sắp diễn ra</h2>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/35">
                  Xem các ngày thi đấu sắp tới
                </p>
              </div>
              <Link
                href="/fixtures"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-500 dark:text-emerald-400"
              >
                Toàn bộ lịch đấu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {!todayLoading && upcomingDates.length > 0 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {upcomingDates.map(dateString => {
                  const date = new Date(`${dateString}T12:00:00`);
                  const isActive = activeDate === dateString;
                  return (
                    <button
                      key={dateString}
                      type="button"
                      onClick={() => setSelectedDate(dateString)}
                      className={cn(
                        'min-w-[76px] shrink-0 rounded-xl border px-3 py-2.5 text-left transition',
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.08)] dark:text-emerald-300'
                          : 'border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/35 dark:hover:bg-white/[0.05]'
                      )}
                    >
                      <span className="block text-[9px] font-bold uppercase tracking-wider">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="mt-0.5 block text-xs font-bold">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {todayLoading ? (
              <LoadingSkeleton type="match" count={3} />
            ) : filteredUpcoming.length > 0 ? (
              <div className="space-y-3">
                {filteredUpcoming.map(match => <MatchCard key={match.id} match={match} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center dark:border-white/10 dark:bg-white/[0.015]">
                <p className="text-sm text-slate-500 dark:text-white/35">Không có trận đấu trong ngày này.</p>
              </div>
            )}
          </section>

          {finishedMatches.length > 0 && (
            <section>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-500" />
                    <h2 className="text-lg font-black text-slate-950 dark:text-white">Kết quả gần đây</h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/35">
                    Các tỷ số chung cuộc mới nhất
                  </p>
                </div>
                <Link
                  href="/results"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-500 dark:text-emerald-400"
                >
                  Tất cả kết quả <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {finishedMatches.slice(0, 4).map(match => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
              </div>
            </section>
          )}
        </main>

        <TournamentSidebar matches={allMatches} />
      </div>
    </div>
  );
}
