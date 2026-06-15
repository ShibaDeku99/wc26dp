'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin,
  Radio, RotateCcw, Sparkles, Trophy, Users,
} from 'lucide-react';
import { FixtureFilters } from '@/components/dashboard/fixture-filters';
import { TVScoreboard } from '@/components/dashboard/tv-scoreboard';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { cn } from '@/lib/utils';
import { getGroupColor } from '@/lib/group-colors';
import type { Match } from '@/types/football';

function localDateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function FixtureCard({ match }: { match: Match }) {
  const colors = getGroupColor(match.group ?? '');

  return (
    <Link
      href={`/matches/${match.id}`}
      className={cn(
        'group block overflow-hidden rounded-2xl border bg-white/75 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/[0.025]',
        match.group ? colors.border : 'border-slate-200 dark:border-white/[0.06]',
        match.group && colors.hoverBorder
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className={cn('text-[9px] font-black uppercase tracking-wider', colors.text)}>
              {match.group}
            </span>
          )}
          <span className="text-[9px] text-slate-400 dark:text-white/25">/</span>
          <span className="text-[9px] text-slate-500 dark:text-white/35">{match.round}</span>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-wider',
          match.status === 'live'
            ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300'
            : match.status === 'finished'
              ? 'border-slate-500/15 bg-slate-500/10 text-slate-500 dark:text-white/35'
              : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
        )}>
          {match.status === 'live' ? <Radio className="h-2.5 w-2.5 animate-pulse" /> :
            match.status === 'finished' ? <CheckCircle2 className="h-2.5 w-2.5" /> :
              <Clock3 className="h-2.5 w-2.5" />}
          {match.status === 'scheduled' ? 'Sắp diễn ra' : match.status === 'live' ? 'Trực tiếp' : match.status === 'finished' ? 'Kết thúc' : 'Hoãn'}
        </span>
      </div>

      <div className="overflow-x-auto px-2 py-3 no-scrollbar sm:px-4">
        <div className="mx-auto min-w-[430px]">
          <TVScoreboard match={match} compact />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2 text-[9px] text-slate-400 dark:border-white/[0.05] dark:text-white/25">
        <span className="flex min-w-0 items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 font-semibold text-emerald-700 transition group-hover:gap-1.5 dark:text-emerald-400">
          Chi tiết trận đấu <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export default function FixturesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const { data, isLoading, error, refetch } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(response => response.json()),
    staleTime: 15 * 60 * 1000,
  });

  const allFixtures = useMemo(
    () => [...(data?.data ?? [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [data?.data]
  );

  const filteredFixtures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allFixtures.filter(match => {
      const matchesSearch = !query ||
        match.homeTeam.name.toLowerCase().includes(query) ||
        match.awayTeam.name.toLowerCase().includes(query) ||
        match.homeTeam.code.toLowerCase().includes(query) ||
        match.awayTeam.code.toLowerCase().includes(query);
      const matchesGroup = !selectedGroup || match.group === selectedGroup || match.group === `Group ${selectedGroup}`;
      const matchesStatus = !selectedStatus || match.status === selectedStatus;
      const matchesDate = !selectedDate || localDateKey(match.date) === selectedDate;
      return matchesSearch && matchesGroup && matchesStatus && matchesDate;
    });
  }, [allFixtures, searchQuery, selectedGroup, selectedStatus, selectedDate]);

  const fixturesByDate = useMemo(() => {
    const grouped = new Map<string, { label: string; shortLabel: string; matches: Match[] }>();
    filteredFixtures.forEach(match => {
      const date = new Date(match.date);
      const key = localDateKey(match.date);
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
          shortLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          matches: [],
        });
      }
      grouped.get(key)?.matches.push(match);
    });
    return Array.from(grouped.values());
  }, [filteredFixtures]);

  const summary = useMemo(() => ({
    scheduled: allFixtures.filter(match => match.status === 'scheduled').length,
    live: allFixtures.filter(match => match.status === 'live').length,
    matchdays: new Set(allFixtures.map(match => localDateKey(match.date))).size,
  }), [allFixtures]);

  const nextMatch = allFixtures.find(match => match.status === 'scheduled');
  const hasFilters = Boolean(searchQuery || selectedGroup || selectedStatus || selectedDate);
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGroup('');
    setSelectedStatus('');
    setSelectedDate('');
  };

  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/10 dark:border-white/[0.07] lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(6,182,212,0.2),transparent_30%),radial-gradient(circle_at_15%_100%,rgba(16,185,129,0.18),transparent_38%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Toàn bộ lịch thi đấu
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <CalendarDays className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-0.04em] lg:text-4xl">Lịch thi đấu</h1>
                <p className="mt-1 text-sm text-white/45">Toàn bộ ngày thi đấu, giờ bóng lăn và sân đấu tại World Cup 2026.</p>
              </div>
            </div>
          </div>

          {nextMatch && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Trận tiếp theo</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex -space-x-1">
                  <img src={nextMatch.homeTeam.flag} alt="" className="h-6 w-8 rounded border border-slate-950 object-cover" />
                  <img src={nextMatch.awayTeam.flag} alt="" className="h-6 w-8 rounded border border-slate-950 object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold">{nextMatch.homeTeam.code} vs {nextMatch.awayTeam.code}</p>
                  <p className="mt-0.5 text-[9px] text-white/35">
                    {new Date(nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} / {new Date(nextMatch.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Tổng số trận', value: allFixtures.length, icon: Trophy, color: 'violet' },
          { label: 'Sắp diễn ra', value: summary.scheduled, icon: Clock3, color: 'cyan' },
          { label: 'Đang trực tiếp', value: summary.live, icon: Radio, color: 'rose' },
          { label: 'Ngày thi đấu', value: summary.matchdays, icon: CalendarDays, color: 'emerald' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{item.value}</p>
              </div>
              <div className={cn(
                'rounded-xl border p-2.5',
                item.color === 'violet' && 'border-violet-500/15 bg-violet-500/10 text-violet-500',
                item.color === 'cyan' && 'border-cyan-500/15 bg-cyan-500/10 text-cyan-500',
                item.color === 'rose' && 'border-rose-500/15 bg-rose-500/10 text-rose-500',
                item.color === 'emerald' && 'border-emerald-500/15 bg-emerald-500/10 text-emerald-500'
              )}>
                <item.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/60 p-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02]">
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
        {hasFilters && (
          <div className="mt-3 flex justify-end border-t border-slate-200 pt-3 dark:border-white/[0.05]">
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-rose-500 dark:text-white/35">
              <RotateCcw className="h-3 w-3" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-white/35">
          Đang hiển thị <span className="font-bold text-slate-900 dark:text-white">{filteredFixtures.length}</span> trận
        </p>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-white/25">
          <Users className="h-3.5 w-3.5" />
          Giờ thi đấu theo múi giờ địa phương
        </span>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="match" count={6} />
      ) : filteredFixtures.length === 0 ? (
        <EmptyState title="Không tìm thấy trận đấu" description="Hãy thử thay đổi đội tuyển, bảng, trạng thái hoặc ngày thi đấu." />
      ) : (
        <div className="space-y-7">
          {fixturesByDate.map(day => (
            <section key={day.label}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 min-w-12 flex-col items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/[0.07] text-cyan-700 dark:text-cyan-300">
                  <span className="text-[9px] font-bold uppercase tracking-wider">{day.shortLabel.split(' ')[0]}</span>
                  <span className="text-sm font-black">{day.shortLabel.split(' ')[1]}</span>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">{day.label}</h2>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-white/30">{day.matches.length} trận đấu</p>
                </div>
                <div className="ml-2 h-px flex-1 bg-slate-200 dark:bg-white/[0.06]" />
              </div>
              <div className="grid gap-3 2xl:grid-cols-2">
                {day.matches.map(match => <FixtureCard key={match.id} match={match} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
