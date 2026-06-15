'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Goal,
  Info,
  Radio,
  Target,
} from 'lucide-react';
import type { Match, Standing } from '@/types/football';

type TopPlayer = {
  player: { id: number | string; name: string; shortName?: string };
  team: { id: number | string; name: string };
  statistics: { goals?: number; appearances?: number };
};

type StatsResponse = {
  topPlayers?: { goals?: TopPlayer[] };
};

function localDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function CardHeader({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={`Xem ${title}`}
          className="text-slate-400 transition-colors hover:text-emerald-500 dark:text-white/25 dark:hover:text-emerald-400"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function TournamentSidebar({ matches }: { matches: Match[] }) {
  const { data: standingsData, isLoading: standingsLoading } = useQuery<{
    data: Record<string, Standing[]>;
  }>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then(response => response.json()),
    staleTime: 60 * 1000,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(response => response.json()),
    staleTime: 60 * 1000,
  });

  const todaySummary = useMemo(() => {
    const today = localDateKey(new Date());
    const todaysMatches = matches.filter(match => localDateKey(match.date) === today);
    const live = todaysMatches.filter(match => match.status === 'live');
    const finished = todaysMatches.filter(match => match.status === 'finished');
    const goals = [...live, ...finished].reduce(
      (total, match) => total + (match.homeScore ?? 0) + (match.awayScore ?? 0),
      0
    );

    return {
      total: todaysMatches.length,
      live: live.length,
      finished: finished.length,
      goals,
      label: new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    };
  }, [matches]);

  const thirdPlaceRace = useMemo(() => {
    const thirdPlaced = Object.entries(standingsData?.data ?? {})
      .flatMap(([group, table]) => {
        const team = table[2];
        return team ? [{ group, ...team }] : [];
      })
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor ||
          a.team.name.localeCompare(b.team.name)
      );

    return { cutoff: thirdPlaced[7], chasing: thirdPlaced[8] };
  }, [standingsData]);

  const topScorers = statsData?.topPlayers?.goals?.slice(0, 3) ?? [];
  const matchesPlayed = matches.filter(match => match.status === 'finished').length;
  const tournamentProgress = Math.round((matchesPlayed / 104) * 100);

  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
      <section className="rounded-2xl border border-slate-300 bg-gradient-to-br from-emerald-500/5 to-transparent p-5 dark:border-white/[0.06]">
        <CardHeader icon={Info} title="Thông tin giải đấu" />
        <div className="mt-4 space-y-2.5 text-[11px]">
          {[
            ['Thể thức', '48 đội, 12 bảng'],
            ['Thời gian', '11/6 - 19/7/2026'],
            ['Địa điểm', '16 sân vận động'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-white/35">{label}</span>
              <span className="font-medium text-slate-700 dark:text-white/75">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500 dark:text-white/35">Đồng chủ nhà</span>
            <span className="flex items-center gap-1.5">
              {['us', 'mx', 'ca'].map(code => (
                <img
                  key={code}
                  src={`https://flagcdn.com/w40/${code}.png`}
                  alt={code.toUpperCase()}
                  className="h-auto w-4 rounded-sm shadow-sm"
                />
              ))}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 dark:text-white/35">Chung kết</span>
            <span className="font-medium text-slate-700 dark:text-white/75">MetLife Stadium, NJ</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-white/[0.06]">
          <div className="mb-1.5 flex justify-between text-[10px]">
            <span className="text-slate-500 dark:text-white/35">{matchesPlayed}/104 trận</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{tournamentProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              style={{ width: `${tournamentProgress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white/50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <CardHeader icon={CalendarDays} title="Tổng quan hôm nay" href="/fixtures" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/25">
          {todaySummary.label}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: 'Trận đấu', value: todaySummary.total, icon: Clock3, color: 'text-cyan-500' },
            { label: 'Trực tiếp', value: todaySummary.live, icon: Radio, color: 'text-rose-500' },
            { label: 'Kết thúc', value: todaySummary.finished, icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'Bàn thắng', value: todaySummary.goals, icon: Goal, color: 'text-amber-500' },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.05] dark:bg-white/[0.025]"
            >
              <div className="flex items-center justify-between">
                <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                <span className="text-lg font-black text-slate-900 dark:text-white">{item.value}</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-500 dark:text-white/35">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white/50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <CardHeader icon={Target} title="Mốc đội hạng ba" href="/standings" />
        {standingsLoading ? (
          <div className="mt-4 h-20 animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.05]" />
        ) : thirdPlaceRace.cutoff ? (
          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Mốc hiện tại / Hạng 8
                </span>
                <span className="text-[10px] text-slate-500 dark:text-white/35">
                  {thirdPlaceRace.cutoff.group.startsWith('Group')
                    ? thirdPlaceRace.cutoff.group
                    : `Group ${thirdPlaceRace.cutoff.group}`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={thirdPlaceRace.cutoff.team.flag}
                    alt=""
                    className="h-5 w-7 rounded-sm object-cover"
                  />
                  <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {thirdPlaceRace.cutoff.team.name}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-black text-emerald-700 dark:text-emerald-400">
                  {thirdPlaceRace.cutoff.points} điểm
                </span>
              </div>
              <p className="mt-1 text-right text-[10px] text-slate-500 dark:text-white/35">
                GD {thirdPlaceRace.cutoff.goalDifference >= 0 ? '+' : ''}
                {thirdPlaceRace.cutoff.goalDifference} · GF {thirdPlaceRace.cutoff.goalsFor}
              </p>
            </div>
            {thirdPlaceRace.chasing && (
              <div className="flex items-center justify-between rounded-lg px-2 py-1 text-[10px] text-slate-500 dark:text-white/35">
                <span className="truncate">Bám đuổi: {thirdPlaceRace.chasing.team.name}</span>
                <span className="shrink-0 font-semibold">{thirdPlaceRace.chasing.points} điểm</span>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-500 dark:text-white/35">Chưa có dữ liệu mốc đi tiếp.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white/50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <CardHeader icon={Flame} title="Cầu thủ nổi bật" href="/stats" />
        <div className="mt-4 space-y-2">
          {statsLoading ? (
            [0, 1, 2].map(item => (
              <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.05]" />
            ))
          ) : topScorers.length > 0 ? (
            topScorers.map((item, index) => (
              <div
                key={item.player.id}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-amber-500/15 hover:bg-amber-500/[0.04]"
              >
                <span className="w-4 text-center text-xs font-black text-slate-400 dark:text-white/25">
                  {index + 1}
                </span>
                <img
                  src={`/api/image?type=player&id=${item.player.id}`}
                  alt={item.player.shortName || item.player.name}
                  className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-white/10 dark:bg-white/5"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {item.player.shortName || item.player.name}
                  </p>
                  <p className="truncate text-[10px] text-slate-500 dark:text-white/35">{item.team.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-amber-600 dark:text-amber-400">
                    {item.statistics.goals ?? 0}
                  </p>
                  <p className="text-[9px] uppercase text-slate-400 dark:text-white/25">Bàn thắng</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 dark:text-white/35">Chưa có thống kê cầu thủ.</p>
          )}
        </div>
      </section>
    </aside>
  );
}
