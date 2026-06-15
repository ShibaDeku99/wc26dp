'use client';

import { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Crown,
  MapPin,
  Network,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGroupColor } from '@/lib/group-colors';

type BracketTeam = {
  name: string;
  seed: string;
  score?: number;
  winner?: boolean;
};

type BracketMatch = {
  id: string;
  date: string;
  venue?: string;
  team1: BracketTeam;
  team2: BracketTeam;
  status?: 'scheduled' | 'live' | 'finished';
};

type Stage = {
  key: string;
  name: string;
  shortName: string;
  dates: string;
  matches: BracketMatch[];
};

const ROUND_OF_32_SLOTS = [
  ['Nhì bảng A', 'Nhì bảng B'],
  ['Nhất bảng C', 'Nhì bảng F'],
  ['Nhất bảng E', 'Hạng ba A/B/C/D/F'],
  ['Nhất bảng F', 'Nhì bảng C'],
  ['Nhì bảng E', 'Nhì bảng I'],
  ['Nhất bảng I', 'Hạng ba C/D/F/G/H'],
  ['Nhất bảng A', 'Hạng ba C/E/F/H/I'],
  ['Nhất bảng L', 'Hạng ba E/H/I/J/K'],
  ['Nhất bảng G', 'Hạng ba A/E/H/I/J'],
  ['Nhất bảng D', 'Hạng ba B/E/F/I/J'],
  ['Nhất bảng H', 'Nhì bảng J'],
  ['Nhì bảng K', 'Nhì bảng L'],
  ['Nhất bảng B', 'Hạng ba E/F/G/I/J'],
  ['Nhì bảng D', 'Nhì bảng G'],
  ['Nhất bảng J', 'Nhì bảng H'],
  ['Nhất bảng K', 'Hạng ba D/E/I/J/L'],
];

const R32_DATES = [
  'Jun 28 · 12:00', 'Jun 29 · 12:00', 'Jun 29 · 16:30', 'Jun 29 · 19:00',
  'Jun 30 · 12:00', 'Jun 30 · 17:00', 'Jun 30 · 19:00', 'Jul 1 · 12:00',
  'Jul 1 · 13:00', 'Jul 1 · 17:00', 'Jul 2 · 12:00', 'Jul 2 · 19:00',
  'Jul 2 · 20:00', 'Jul 3 · 13:00', 'Jul 3 · 18:00', 'Jul 3 · 20:30',
];

function createMatches(
  count: number,
  prefix: string,
  dates: string[],
  sourceRound: string
): BracketMatch[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    date: dates[index] ?? 'TBD',
    team1: {
      name: `Đội thắng ${sourceRound} ${index * 2 + 1}`,
      seed: `W${index * 2 + 1}`,
    },
    team2: {
      name: `Đội thắng ${sourceRound} ${index * 2 + 2}`,
      seed: `W${index * 2 + 2}`,
    },
    status: 'scheduled',
  }));
}

const roundOf32: BracketMatch[] = ROUND_OF_32_SLOTS.map((slots, index) => ({
  id: `r32-${index + 1}`,
  date: R32_DATES[index],
  team1: { name: slots[0], seed: `${index + 1}A` },
  team2: { name: slots[1], seed: `${index + 1}B` },
  status: 'scheduled',
}));

const roundOf16 = createMatches(
  8,
  'r16',
  ['Jul 4 · 12:00', 'Jul 4 · 17:00', 'Jul 5 · 16:00', 'Jul 5 · 18:00', 'Jul 6 · 14:00', 'Jul 6 · 17:00', 'Jul 7 · 12:00', 'Jul 7 · 13:00'],
  'R32'
);
const quarterFinals = createMatches(
  4,
  'qf',
  ['Jul 9 · 16:00', 'Jul 10 · 12:00', 'Jul 11 · 17:00', 'Jul 11 · 20:00'],
  'R16'
);
const semiFinals = createMatches(
  2,
  'sf',
  ['Jul 14 · 14:00', 'Jul 15 · 15:00'],
  'QF'
);

const finalMatch: BracketMatch = {
  id: 'final',
  date: 'Jul 19 · 15:00',
  venue: 'MetLife Stadium, NJ',
  team1: { name: 'Đội thắng bán kết 1', seed: 'BK1' },
  team2: { name: 'Đội thắng bán kết 2', seed: 'BK2' },
  status: 'scheduled',
};

const thirdPlaceMatch: BracketMatch = {
  id: 'third-place',
  date: 'Jul 18 · 17:00',
  venue: 'Hard Rock Stadium, Miami',
  team1: { name: 'Đội thua bán kết 1', seed: 'T1' },
  team2: { name: 'Đội thua bán kết 2', seed: 'T2' },
  status: 'scheduled',
};

const stages: Stage[] = [
  {
    key: 'r32',
    name: 'Vòng 32 đội',
    shortName: 'R32',
    dates: 'Jun 28 - Jul 3',
    matches: roundOf32,
  },
  {
    key: 'r16',
    name: 'Vòng 16 đội',
    shortName: 'R16',
    dates: 'Jul 4 - Jul 7',
    matches: roundOf16,
  },
  {
    key: 'qf',
    name: 'Tứ kết',
    shortName: 'QF',
    dates: 'Jul 9 - Jul 11',
    matches: quarterFinals,
  },
  {
    key: 'sf',
    name: 'Bán kết',
    shortName: 'SF',
    dates: 'Jul 14 - Jul 15',
    matches: semiFinals,
  },
];

const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('');

const GROUP_DOT_COLORS: Record<string, string> = {
  A: 'bg-emerald-500',
  B: 'bg-cyan-500',
  C: 'bg-sky-500',
  D: 'bg-blue-500',
  E: 'bg-indigo-500',
  F: 'bg-violet-500',
  G: 'bg-purple-500',
  H: 'bg-fuchsia-500',
  I: 'bg-pink-500',
  J: 'bg-rose-500',
  K: 'bg-red-500',
  L: 'bg-orange-500',
};

function getTeamGroups(name: string) {
  const directGroup = name.match(/(?:Group|bảng) ([A-L])/i);
  if (directGroup) return [directGroup[1]];

  const thirdPlaceGroups = name.match(/^(?:3rd|Hạng ba) ([A-L/]+)/i);
  return thirdPlaceGroups ? thirdPlaceGroups[1].split('/') : [];
}

function TeamRow({ team }: { team: BracketTeam }) {
  const groupLetters = getTeamGroups(team.name);
  const primaryGroup = groupLetters[0];
  const groupColors = getGroupColor(primaryGroup ? `Group ${primaryGroup}` : '');

  return (
    <div
      className={cn(
        'relative flex min-h-9 items-center gap-2 overflow-hidden px-3 py-2',
        primaryGroup && groupColors.bg,
        team.winner && 'bg-emerald-500/[0.08]'
      )}
    >
      {primaryGroup && (
        <span className={cn('absolute inset-y-0 left-0 w-0.5', GROUP_DOT_COLORS[primaryGroup])} />
      )}
      {groupLetters.length === 1 ? (
        <span
          className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-md border px-1 text-[8px] font-black',
            groupColors.border,
            groupColors.bg,
            groupColors.text
          )}
          title={`Bảng ${primaryGroup}`}
        >
          {primaryGroup}
        </span>
      ) : groupLetters.length > 1 ? (
        <span
          className="flex h-5 items-center gap-0.5 rounded-md border border-slate-200 bg-white/70 px-1 dark:border-white/[0.07] dark:bg-black/15"
          title={`Các bảng có thể: ${groupLetters.join(', ')}`}
        >
          {groupLetters.map(letter => (
            <span
              key={letter}
              className={cn('h-1.5 w-1.5 rounded-full', GROUP_DOT_COLORS[letter])}
            />
          ))}
        </span>
      ) : (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-1 text-[8px] font-black text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.05] dark:text-white/35">
          {team.seed}
        </span>
      )}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-600 dark:text-white/55',
          groupLetters.length === 1 && groupColors.text,
          team.winner && 'text-emerald-700 dark:text-emerald-300'
        )}
      >
        {team.name}
      </span>
      <span className="text-sm font-black tabular-nums text-slate-400 dark:text-white/25">
        {team.score ?? '-'}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  direction = 'right',
  featured = false,
}: {
  match: BracketMatch;
  direction?: 'left' | 'right';
  featured?: boolean;
}) {
  return (
    <div className="group relative">
      {!featured && (
        <div
          className={cn(
            'absolute top-1/2 hidden w-5 border-t border-slate-300 dark:border-white/10 xl:block',
            direction === 'right' ? '-right-5' : '-left-5'
          )}
        />
      )}
      <div
        className={cn(
          'overflow-hidden rounded-xl border bg-white/85 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0d1220]/90',
          featured
            ? 'border-amber-500/30 shadow-xl shadow-amber-500/10'
            : 'border-slate-200 hover:border-emerald-500/25 dark:border-white/[0.07]'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b px-3 py-1.5 text-[9px] font-semibold dark:border-white/[0.06]',
            featured
              ? 'border-amber-500/15 bg-amber-500/[0.08] text-amber-700 dark:text-amber-300'
              : 'border-slate-100 bg-slate-50/80 text-slate-400 dark:bg-white/[0.025] dark:text-white/30'
          )}
        >
          <span>{match.date}</span>
          <span className="flex items-center gap-1 uppercase tracking-wider">
            <CircleDashed className="h-2.5 w-2.5" />
            Sắp diễn ra
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
          <TeamRow team={match.team1} />
          <TeamRow team={match.team2} />
        </div>
        {match.venue && (
          <div className="flex items-center gap-1.5 border-t border-slate-100 px-3 py-2 text-[9px] text-slate-400 dark:border-white/[0.05] dark:text-white/25">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate">{match.venue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StageHeader({
  stage,
  align = 'left',
}: {
  stage: Stage;
  align?: 'left' | 'right';
}) {
  return (
    <div className={cn('mb-4', align === 'right' && 'text-right')}>
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'right' && 'flex-row-reverse'
        )}
      >
        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
          {stage.shortName}
        </span>
        <h2 className="text-xs font-black text-slate-900 dark:text-white">{stage.name}</h2>
      </div>
      <p className="mt-1 text-[9px] text-slate-400 dark:text-white/25">{stage.dates}</p>
    </div>
  );
}

function StageColumn({
  stage,
  matches,
  direction,
}: {
  stage: Stage;
  matches: BracketMatch[];
  direction: 'left' | 'right';
}) {
  return (
    <section className="w-[220px] shrink-0">
      <StageHeader stage={stage} align={direction === 'left' ? 'right' : 'left'} />
      <div className="flex h-[930px] flex-col justify-around">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} direction={direction} />
        ))}
      </div>
    </section>
  );
}

export default function BracketClient() {
  const [activeRound, setActiveRound] = useState('all');

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/10 dark:border-white/[0.07] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(245,158,11,0.2),transparent_28%),radial-gradient(circle_at_15%_100%,rgba(16,185,129,0.18),transparent_35%)]" />
        <div className="pointer-events-none absolute right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Hành trình đến New Jersey
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <Network className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-0.04em] lg:text-4xl">
                  Sơ đồ vòng loại trực tiếp
                </h1>
                <p className="mt-1 text-sm text-white/45">
                  Một hành trình, năm vòng đấu, một nhà vô địch thế giới.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              ['32', 'Đội'],
              ['32', 'Trận'],
              ['5', 'Vòng'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="min-w-[78px] rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2.5 text-center backdrop-blur-xl"
              >
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/60 p-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/35">
          <Shield className="h-4 w-4 text-emerald-500" />
          Đội thắng tiến dần vào trận chung kết ở trung tâm
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveRound('all')}
            className={cn(
              'shrink-0 rounded-xl border px-3 py-2 text-[10px] font-bold transition',
              activeRound === 'all'
                ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 bg-white/60 text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35'
            )}
          >
            Toàn bộ sơ đồ
          </button>
          {stages.map(stage => (
            <button
              key={stage.key}
              type="button"
              onClick={() => setActiveRound(stage.key)}
              className={cn(
                'shrink-0 rounded-xl border px-3 py-2 text-[10px] font-bold transition',
                activeRound === stage.key
                  ? 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 bg-white/60 text-slate-500 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35 dark:hover:bg-white/[0.05]'
              )}
            >
              {stage.shortName}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveRound('final')}
            className={cn(
              'shrink-0 rounded-xl border px-3 py-2 text-[10px] font-bold transition',
              activeRound === 'final'
                ? 'border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 bg-white/60 text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35'
            )}
          >
            Chung kết
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white/40 px-3 py-2 no-scrollbar dark:border-white/[0.05] dark:bg-white/[0.015]">
        <span className="mr-1 shrink-0 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">
          Màu đại diện bảng
        </span>
        {GROUP_LETTERS.map(letter => {
          const colors = getGroupColor(`Group ${letter}`);
          return (
            <span
              key={letter}
              className={cn(
                'flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg border text-[9px] font-black',
                colors.border,
                colors.bg,
                colors.text
              )}
              title={`Bảng ${letter}`}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {activeRound === 'all' ? (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 dark:border-white/[0.06] dark:bg-[#080d18]/70">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-[10px] text-slate-400 dark:border-white/[0.06] dark:text-white/30">
            <span className="flex items-center gap-1.5">
              <ChevronLeft className="h-3.5 w-3.5" />
              Cuộn để xem toàn bộ sơ đồ
            </span>
            <span className="flex items-center gap-1.5">
              Chung kết ở trung tâm
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="overflow-x-auto px-5 pb-8 pt-5 no-scrollbar">
            <div className="mx-auto flex w-max min-w-full items-start justify-center gap-5">
              <StageColumn stage={stages[0]} matches={roundOf32.slice(0, 8)} direction="right" />
              <StageColumn stage={stages[1]} matches={roundOf16.slice(0, 4)} direction="right" />
              <StageColumn stage={stages[2]} matches={quarterFinals.slice(0, 2)} direction="right" />
              <StageColumn stage={stages[3]} matches={semiFinals.slice(0, 1)} direction="right" />

              <section className="flex h-[1010px] w-[260px] shrink-0 flex-col items-center justify-center">
                <div className="mb-5 text-center">
                  <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/[0.08]">
                    <div className="absolute inset-3 rounded-full border border-amber-400/15" />
                    <Trophy className="relative h-11 w-11 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
                    Chung kết FIFA World Cup
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">New York New Jersey</h2>
                </div>
                <div className="w-full">
                  <MatchCard match={finalMatch} featured />
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                  <Crown className="h-3.5 w-3.5" />
                  Nhà vô địch thế giới
                </div>
              </section>

              <StageColumn stage={stages[3]} matches={semiFinals.slice(1)} direction="left" />
              <StageColumn stage={stages[2]} matches={quarterFinals.slice(2)} direction="left" />
              <StageColumn stage={stages[1]} matches={roundOf16.slice(4)} direction="left" />
              <StageColumn stage={stages[0]} matches={roundOf32.slice(8)} direction="left" />
            </div>
          </div>
        </section>
      ) : activeRound === 'final' ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
          <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.1] to-transparent p-6 dark:border-amber-500/15">
            <Trophy className="mb-5 h-12 w-12 text-amber-500" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
              Trận tranh chức vô địch
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Bước cuối cùng</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/40">
              Hai đội thắng bán kết gặp nhau tại sân MetLife vào ngày 19 tháng 7 năm 2026.
            </p>
          </section>
          <div className="space-y-4">
            <MatchCard match={finalMatch} featured />
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30">
                <Shield className="h-3.5 w-3.5" />
                Tranh hạng ba
              </div>
              <MatchCard match={thirdPlaceMatch} />
            </div>
          </div>
        </div>
      ) : (
        <section>
          {stages
            .filter(stage => stage.key === activeRound)
            .map(stage => (
              <div key={stage.key}>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">{stage.name}</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-white/35">{stage.dates}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-white/30">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {stage.matches.length} trận
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {stage.matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}
    </div>
  );
}
