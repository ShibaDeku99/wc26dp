'use client';

import { CalendarClock, CheckCircle2, Info, ShieldAlert, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Match, Standing } from '@/types/football';

type ThirdPlaceEntry = {
  standing: Standing;
  groupName: string;
};

interface ThirdPlaceRaceProps {
  entries: ThirdPlaceEntry[];
  fixtures: Match[];
}

function compareStandings(a: Standing, b: Standing) {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  return b.goalsFor - a.goalsFor;
}

function getResultPlan(pointsNeeded: number, matchesRemaining: number) {
  if (pointsNeeded <= 0) return 'Giữ vững vị trí và cải thiện hiệu số';

  const options: Array<{ wins: number; draws: number; points: number }> = [];

  for (let wins = 0; wins <= matchesRemaining; wins += 1) {
    for (let draws = 0; draws <= matchesRemaining - wins; draws += 1) {
      const points = wins * 3 + draws;
      if (points >= pointsNeeded) options.push({ wins, draws, points });
    }
  }

  options.sort((a, b) => {
    if (a.points !== b.points) return a.points - b.points;
    const aGames = a.wins + a.draws;
    const bGames = b.wins + b.draws;
    if (aGames !== bGames) return aGames - bGames;
    return a.wins - b.wins;
  });

  const best = options[0];
  if (!best) return 'Không thể vượt mốc hiện tại chỉ bằng điểm số';

  const parts = [];
  if (best.wins) parts.push(`${best.wins} trận thắng`);
  if (best.draws) parts.push(`${best.draws} trận hòa`);
  return `Ít nhất ${parts.join(' + ')}`;
}

function formatOpponent(match: Match, teamId: string) {
  const opponent = match.homeTeam.id === teamId ? match.awayTeam : match.homeTeam;
  const date = new Date(match.date);

  return {
    name: opponent.name,
    flag: opponent.flag,
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

export function ThirdPlaceRace({ entries, fixtures }: ThirdPlaceRaceProps) {
  const sortedEntries = [...entries].sort((a, b) => compareStandings(a.standing, b.standing));
  const cutoff = sortedEntries[7]?.standing;
  const cutoffPoints = cutoff?.points ?? 0;
  const cutoffGoalDifference = cutoff?.goalDifference ?? 0;

  return (
    <section className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Cuộc đua hạng ba chuyên sâu
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-white/40">
            8 trong 12 đội hạng ba có thành tích tốt nhất sẽ vào vòng 32 đội.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-cyan-700 dark:text-cyan-300">
            Mốc hiện tại: <strong>{cutoffPoints} điểm</strong>, HS{' '}
            <strong>{cutoffGoalDifference > 0 ? '+' : ''}{cutoffGoalDifference}</strong>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
            Thứ tự trực tiếp: điểm, hiệu số, bàn thắng
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ['1', 'Điểm'],
          ['2', 'Hiệu số'],
          ['3', 'Bàn thắng'],
          ['4', 'Điểm fair-play'],
          ['5', 'Xếp hạng FIFA mới nhất'],
          ['6', 'Xếp hạng FIFA trước đó'],
        ].map(([order, label]) => (
          <div
            key={order}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
              {order}
            </span>
            <span className="text-[11px] font-medium text-slate-700 dark:text-white/60">{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white to-cyan-50/70 overflow-hidden shadow-lg shadow-cyan-500/5 dark:from-[#0B1021] dark:to-cyan-950/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 dark:border-white/5 dark:bg-white/[0.02]">
                <th className="w-10 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">#</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">Đội</th>
                <th className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">ST</th>
                <th className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">Điểm</th>
                <th className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">HS</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">Còn lại</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">Đối thủ tiếp theo</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">Kết quả cần thiết</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/30">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map(({ standing, groupName }, index) => {
                const isCurrentlyQualified = index < 8;
                const groupFixtures = fixtures
                  .filter(match =>
                    match.group === groupName &&
                    match.round.startsWith('Matchday') &&
                    match.status !== 'finished' &&
                    (match.homeTeam.id === standing.team.id || match.awayTeam.id === standing.team.id)
                  )
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                const matchesRemaining = Math.max(groupFixtures.length, 3 - standing.played);
                const nextMatch = groupFixtures[0];
                const nextOpponent = nextMatch ? formatOpponent(nextMatch, standing.team.id) : null;
                const maximumPoints = standing.points + matchesRemaining * 3;
                const pointsNeededToClear = Math.max(0, cutoffPoints + 1 - standing.points);
                const canTieCutoff = maximumPoints >= cutoffPoints;
                const plan = getResultPlan(pointsNeededToClear, matchesRemaining);

                let status = isCurrentlyQualified ? 'Trong vùng đi tiếp' : 'Ngoài vùng đi tiếp';
                let statusClass = isCurrentlyQualified
                  ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
                let StatusIcon = isCurrentlyQualified ? CheckCircle2 : ShieldAlert;

                if (matchesRemaining === 0) {
                  status = isCurrentlyQualified ? 'Hiện đang đi tiếp' : 'Hiện đang bị loại';
                } else if (maximumPoints < cutoffPoints) {
                  status = 'Không thể chạm mốc hiện tại';
                  statusClass = 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300';
                  StatusIcon = ShieldAlert;
                } else if (!isCurrentlyQualified && canTieCutoff && maximumPoints < cutoffPoints + 1) {
                  status = 'Phải vượt tiêu chí phụ';
                }

                return (
                  <tr
                    key={standing.team.id}
                    className={cn(
                      'border-b border-slate-200 transition-colors dark:border-white/[0.04]',
                      isCurrentlyQualified
                        ? 'bg-cyan-500/[0.035] hover:bg-cyan-500/[0.07]'
                        : 'hover:bg-slate-100 dark:hover:bg-white/[0.03]',
                      index === 7 && 'border-b-2 border-b-cyan-500/50'
                    )}
                  >
                    <td className="px-3 py-3">
                      <div className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold',
                        isCurrentlyQualified
                          ? 'border border-cyan-500/20 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/30'
                      )}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <img src={standing.team.flag} alt="" className="h-5 w-7 rounded-sm object-cover" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{standing.team.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-white/30">{groupName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center text-xs text-slate-600 dark:text-white/50">{standing.played}</td>
                    <td className="px-2 py-3 text-center font-bold text-slate-900 dark:text-white">{standing.points}</td>
                    <td className={cn(
                      'px-2 py-3 text-center text-xs font-medium',
                      standing.goalDifference > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : standing.goalDifference < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-600 dark:text-white/50'
                    )}>
                      {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-white/70">{matchesRemaining}</span>
                        <span className="text-[10px] text-slate-500 dark:text-white/30">
                          tối đa {maximumPoints} điểm
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {nextOpponent ? (
                        <div className="flex items-center gap-2">
                          <img src={nextOpponent.flag} alt="" className="h-4 w-6 rounded-sm object-cover" />
                          <div>
                            <div className="text-xs font-medium text-slate-800 dark:text-white/70">{nextOpponent.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-white/30">{nextOpponent.date}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-white/25">Không còn trận đấu</span>
                      )}
                    </td>
                    <td className="max-w-[220px] px-3 py-3">
                      <div className="text-xs font-medium text-slate-800 dark:text-white/70">{plan}</div>
                      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-white/30">
                        Mục tiêu: {Math.max(standing.points, cutoffPoints + 1)} điểm
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold',
                        statusClass
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 border-t border-cyan-500/10 bg-cyan-500/[0.03] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-white/40">
            Kết quả cần thiết được tính theo mốc hạng 8 trực tiếp. Mục tiêu có thể tăng khi các bảng khác thi đấu.
            Bảng hiện áp dụng ba tiêu chí đầu tiên; điểm fair-play và xếp hạng FIFA chưa có trong nguồn dữ liệu hiện tại.
          </p>
        </div>
      </div>
    </section>
  );
}
