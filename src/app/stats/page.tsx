'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  BarChart3,
  Flame,
  Goal,
  Medal,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  WandSparkles,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { cn } from '@/lib/utils';

type RawPlayerStat = {
  player: {
    id: number | string;
    name: string;
    shortName?: string;
  };
  team: {
    id: number | string;
    name: string;
  };
  statistics: {
    goals?: number;
    assists?: number;
    cleanSheet?: number;
    appearances?: number;
    rating?: number;
  };
};

type StatsResponse = {
  topPlayers?: {
    goals?: RawPlayerStat[];
    assists?: RawPlayerStat[];
    cleanSheet?: RawPlayerStat[];
  };
};

type StatKey = 'goals' | 'assists' | 'cleanSheet';

type PlayerItem = {
  id: string;
  name: string;
  teamName: string;
  flag: string;
  stat: number;
  appearances: number;
  rating?: number;
  imageUrl: string;
};

const STAT_TABS: Array<{
  key: StatKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  accent: string;
  barColor: string;
}> = [
  {
    key: 'goals',
    label: 'Vua phá lưới',
    shortLabel: 'Bàn thắng',
    icon: Target,
    accent: 'amber',
    barColor: '#f59e0b',
  },
  {
    key: 'assists',
    label: 'Vua kiến tạo',
    shortLabel: 'Kiến tạo',
    icon: WandSparkles,
    accent: 'emerald',
    barColor: '#10b981',
  },
  {
    key: 'cleanSheet',
    label: 'Thủ môn',
    shortLabel: 'Giữ sạch lưới',
    icon: ShieldCheck,
    accent: 'cyan',
    barColor: '#06b6d4',
  },
];

const FLAG_CODES: Record<string, string> = {
  USA: 'us', Mexico: 'mx', Canada: 'ca', Argentina: 'ar', France: 'fr',
  Brazil: 'br', England: 'gb-eng', Spain: 'es', Germany: 'de', Portugal: 'pt',
  Netherlands: 'nl', Italy: 'it', Croatia: 'hr', Uruguay: 'uy', Colombia: 'co',
  Senegal: 'sn', Japan: 'jp', 'South Korea': 'kr', Morocco: 'ma', Switzerland: 'ch',
  Belgium: 'be', Ecuador: 'ec', Poland: 'pl', Australia: 'au', Ghana: 'gh',
  Serbia: 'rs', Denmark: 'dk', Tunisia: 'tn', Cameroon: 'cm', 'Saudi Arabia': 'sa',
  Iran: 'ir', Wales: 'gb-wls', 'Costa Rica': 'cr', Qatar: 'qa', 'Ivory Coast': 'ci',
  Nigeria: 'ng', Algeria: 'dz', Egypt: 'eg', Mali: 'ml', Sweden: 'se',
  Norway: 'no', Turkey: 'tr', Ukraine: 'ua', Scotland: 'gb-sct', Peru: 'pe',
  Chile: 'cl', Paraguay: 'py', Venezuela: 've', Panama: 'pa', Jamaica: 'jm',
  'Bosnia & Herzegovina': 'ba', Austria: 'at', 'Czech Republic': 'cz',
  'South Africa': 'za', Haiti: 'ht', 'New Zealand': 'nz',
};

function getFlagUrl(teamName: string) {
  const code = FLAG_CODES[teamName];
  return code
    ? `https://flagcdn.com/w80/${code}.png`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teamName)}&backgroundColor=0f172a&textColor=ffffff`;
}

function mapPlayers(source: RawPlayerStat[] | undefined, key: StatKey, limit = 10): PlayerItem[] {
  return (source ?? []).slice(0, limit).map(item => ({
    id: String(item.player.id),
    name: item.player.shortName || item.player.name,
    teamName: item.team.name,
    flag: getFlagUrl(item.team.name),
    stat: Number(item.statistics[key] ?? 0),
    appearances: Number(item.statistics.appearances ?? 0),
    rating: item.statistics.rating,
    imageUrl: `/api/image?type=player&id=${item.player.id}`,
  }));
}

function LeaderCard({
  player,
  label,
  icon: Icon,
  accent,
}: {
  player?: PlayerItem;
  label: string;
  icon: React.ElementType;
  accent: string;
}) {
  const styles: Record<string, { card: string; icon: string; value: string }> = {
    amber: {
      card: 'border-amber-500/20 bg-amber-500/[0.07]',
      icon: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300',
      value: 'text-amber-600 dark:text-amber-300',
    },
    emerald: {
      card: 'border-emerald-500/20 bg-emerald-500/[0.07]',
      icon: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      value: 'text-emerald-600 dark:text-emerald-300',
    },
    cyan: {
      card: 'border-cyan-500/20 bg-cyan-500/[0.07]',
      icon: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
      value: 'text-cyan-600 dark:text-cyan-300',
    },
  };
  const theme = styles[accent];

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border p-4', theme.card)}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30 blur-3xl dark:bg-white/[0.03]" />
      <div className="relative flex items-start justify-between">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl border', theme.icon)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-right">
          <p className={cn('text-3xl font-black leading-none', theme.value)}>{player?.stat ?? 0}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/25">
            {label}
          </p>
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/40 bg-white/50 shadow-sm dark:border-white/10 dark:bg-white/5">
          {player ? (
            <img
              src={player.imageUrl}
              alt={player.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-white/5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950 dark:text-white">
            {player?.name ?? 'Đang chờ dữ liệu'}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {player && <img src={player.flag} alt="" className="h-3.5 w-5 rounded-sm object-cover" />}
            <span className="truncate text-[10px] text-slate-500 dark:text-white/35">
              {player?.teamName ?? 'Dẫn đầu giải đấu'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceChart({
  data,
  label,
  color,
}: {
  data: PlayerItem[];
  label: string;
  color: string;
}) {
  const chartData = data.slice(0, 7).map(player => ({
    ...player,
    chartName: player.name.split(' ').slice(-1)[0],
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.025] lg:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-black text-slate-950 dark:text-white">So sánh nhóm dẫn đầu</h2>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-white/35">Bảy cầu thủ dẫn đầu theo chỉ số {label.toLowerCase()}</p>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35">
          {label}
        </span>
      </div>
      <div className="h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/[0.06]" vertical={false} />
            <XAxis
              dataKey="chartName"
              tickLine={false}
              axisLine={false}
              fontSize={9}
              tick={{ fill: '#94a3b8' }}
              dy={9}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              fontSize={9}
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '11px',
              }}
              formatter={(value) => [String(value), label]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ''}
            />
            <Bar dataKey="stat" name={label} radius={[6, 6, 2, 2]} maxBarSize={34}>
              {chartData.map((player, index) => (
                <Cell key={player.id} fill={color} opacity={Math.max(0.4, 1 - index * 0.09)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Leaderboard({ data, label, color }: { data: PlayerItem[]; label: string; color: string }) {
  const maxStat = Math.max(...data.map(player => player.stat), 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-white/[0.06] lg:px-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-black text-slate-950 dark:text-white">Bảng xếp hạng đầy đủ</h2>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-white/35">Xếp hạng giải đấu theo chỉ số {label.toLowerCase()}</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-white/25">TOP {data.length}</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
        {data.length > 0 ? data.map((player, index) => (
          <div key={player.id} className="group relative flex items-center gap-3 overflow-hidden px-4 py-3.5 transition hover:bg-slate-50 dark:hover:bg-white/[0.025] lg:px-5">
            <div
              className="absolute inset-y-0 left-0 opacity-[0.07] transition-all duration-700 group-hover:opacity-[0.12]"
              style={{ width: `${(player.stat / maxStat) * 100}%`, backgroundColor: color }}
            />
            <div className={cn(
              'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black',
              index === 0 && 'bg-amber-500/12 text-amber-600 dark:text-amber-300',
              index === 1 && 'bg-slate-400/10 text-slate-500 dark:text-slate-300',
              index === 2 && 'bg-orange-500/10 text-orange-600 dark:text-orange-300',
              index > 2 && 'text-slate-400 dark:text-white/25'
            )}>
              {index === 0 ? <Medal className="h-4 w-4" /> : index + 1}
            </div>
            <img
              src={player.imageUrl}
              alt={player.name}
              className="relative h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover dark:border-white/10 dark:bg-white/5"
            />
            <div className="relative min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{player.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <img src={player.flag} alt="" className="h-3 w-4 rounded-[2px] object-cover" />
                <span className="truncate text-[10px] text-slate-500 dark:text-white/35">{player.teamName}</span>
              </div>
            </div>
            <div className="relative hidden text-right sm:block">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-white/35">{player.appearances} trận</p>
              {player.rating && <p className="mt-0.5 text-[9px] text-slate-400 dark:text-white/25">Rating {player.rating.toFixed(1)}</p>}
            </div>
            <div className="relative min-w-10 text-right">
              <p className="text-xl font-black text-slate-950 dark:text-white">{player.stat}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/25">{label}</p>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-sm text-slate-500 dark:text-white/35">
          Chưa có dữ liệu thống kê.
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [activeStat, setActiveStat] = useState<StatKey>('goals');

  const { data, isLoading, isFetching, refetch } = useQuery<StatsResponse>({
    queryKey: ['playerStats'],
    queryFn: () => fetch('/api/stats').then(response => response.json()),
    refetchInterval: 60 * 1000,
  });

  const leaders = useMemo(() => ({
    goals: mapPlayers(data?.topPlayers?.goals, 'goals'),
    assists: mapPlayers(data?.topPlayers?.assists, 'assists'),
    cleanSheet: mapPlayers(data?.topPlayers?.cleanSheet, 'cleanSheet'),
  }), [data]);

  const activeConfig = STAT_TABS.find(tab => tab.key === activeStat) ?? STAT_TABS[0];
  const activePlayers = leaders[activeStat];

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <LoadingSkeleton type="hero" />
        <LoadingSkeleton type="card" count={3} />
        <LoadingSkeleton type="table" count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/10 dark:border-white/[0.07] lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_20%_100%,rgba(6,182,212,0.16),transparent_38%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Phân tích giải đấu trực tiếp
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-0.04em] lg:text-4xl">Thống kê cầu thủ</h1>
                <p className="mt-1 text-sm text-white/45">Theo dõi người dẫn đầu về bàn thắng, kiến tạo và giữ sạch lưới.</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            {isFetching ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}
          </button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <LeaderCard player={leaders.goals[0]} label="Bàn thắng" icon={Flame} accent="amber" />
        <LeaderCard player={leaders.assists[0]} label="Kiến tạo" icon={WandSparkles} accent="emerald" />
        <LeaderCard player={leaders.cleanSheet[0]} label="Giữ sạch lưới" icon={ShieldCheck} accent="cyan" />
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/60 p-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/35">
          <Activity className="h-4 w-4 text-emerald-500" />
          Chọn chỉ số để cập nhật biểu đồ và bảng xếp hạng
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STAT_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStat(tab.key)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold transition',
                activeStat === tab.key
                  ? tab.accent === 'amber'
                    ? 'border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300'
                    : tab.accent === 'emerald'
                      ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                      : 'border-cyan-500/30 bg-cyan-500/12 text-cyan-700 dark:text-cyan-300'
                  : 'border-slate-200 bg-white/60 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35 dark:hover:bg-white/[0.05]'
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <PerformanceChart
          data={activePlayers}
          label={activeConfig.shortLabel}
          color={activeConfig.barColor}
        />
        <Leaderboard
          data={activePlayers}
          label={activeConfig.shortLabel}
          color={activeConfig.barColor}
        />
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Goal, label: 'Chiếc giày vàng', detail: 'Ghi nhiều bàn thắng nhất', color: 'text-amber-500' },
          { icon: WandSparkles, label: 'Vua kiến tạo', detail: 'Kiến tạo nhiều nhất', color: 'text-emerald-500' },
          { icon: ShieldCheck, label: 'Găng tay vàng', detail: 'Giữ sạch lưới nhiều nhất', color: 'text-cyan-500' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.015]">
            <item.icon className={cn('h-4 w-4', item.color)} />
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-white/70">{item.label}</p>
              <p className="text-[9px] text-slate-400 dark:text-white/25">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
