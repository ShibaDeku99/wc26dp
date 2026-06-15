import type { Standing } from '@/types/football';
import { cn } from '@/lib/utils';
import { getGroupColor } from '@/lib/group-colors';

interface StandingsTableProps {
  standings: Standing[];
  groupName: string;
  highlightTop?: number;
}

const statHeaderClass =
  'w-7 px-0.5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-white/35';

const statCellClass =
  'px-0.5 py-3.5 text-center text-xs tabular-nums text-slate-600 dark:text-white/55';

export function StandingsTable({
  standings,
  groupName,
  highlightTop = 2,
}: StandingsTableProps) {
  const colors = getGroupColor(groupName);
  const matchesPlayed = standings.reduce((total, standing) => total + standing.played, 0);

  return (
    <article
      className={cn(
        'group relative isolate overflow-hidden rounded-[22px] border bg-white/85 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300',
        'dark:bg-[#0b0717]/90 dark:shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)]',
        colors.border,
        colors.hoverBorder,
        colors.shadow
      )}
    >
      <div className={cn('pointer-events-none absolute inset-x-12 -top-16 h-28 rounded-full blur-3xl opacity-40', colors.bg)} />

      <header className="relative flex min-h-14 items-center justify-between border-b border-slate-200/80 px-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className={cn('h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]', colors.text, colors.bg)} />
          <h3 className={cn('text-base font-extrabold tracking-tight', colors.text)}>{groupName}</h3>
        </div>
        <span className="text-[11px] font-medium tabular-nums text-slate-400 dark:text-white/30">
          {matchesPlayed} lượt trận
        </span>
      </header>

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[400px] table-fixed">
          <colgroup>
            <col className="w-11" />
            <col />
            <col className="w-7" />
            <col className="w-7" />
            <col className="w-7" />
            <col className="w-7" />
            <col className="w-8" />
            <col className="w-8" />
            <col className="w-9" />
            <col className="w-10" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 dark:border-white/[0.06] dark:bg-white/[0.015]">
              <th className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30">#</th>
              <th className="px-2 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-white/30">Đội</th>
              <th className={statHeaderClass}>ST</th>
              <th className={statHeaderClass}>T</th>
              <th className={statHeaderClass}>H</th>
              <th className={statHeaderClass}>B</th>
              <th className={statHeaderClass}>BT</th>
              <th className={statHeaderClass}>BB</th>
              <th className={statHeaderClass}>HS</th>
              <th className={cn(statHeaderClass, 'text-emerald-600 dark:text-emerald-400')}>Đ</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((standing, index) => {
              const isDirectQualifier = index < highlightTop;
              const isThirdPlace = index === highlightTop;

              return (
                <tr
                  key={standing.team.id}
                  className={cn(
                    'border-b border-slate-200/70 transition-colors last:border-b-0 dark:border-white/[0.045]',
                    'hover:bg-slate-100/80 dark:hover:bg-white/[0.045]',
                    isDirectQualifier && 'bg-emerald-500/[0.025]',
                    isThirdPlace && 'bg-cyan-500/[0.025]'
                  )}
                >
                  <td className="px-2 py-3.5 text-center">
                    <span
                      className={cn(
                        'mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold tabular-nums',
                        isDirectQualifier
                          ? 'border border-emerald-500/20 bg-emerald-500/15 text-emerald-700 shadow-[0_0_14px_rgba(16,185,129,0.08)] dark:text-emerald-300'
                          : isThirdPlace
                            ? 'border border-cyan-500/20 bg-cyan-500/15 text-cyan-700 shadow-[0_0_14px_rgba(6,182,212,0.08)] dark:text-cyan-300'
                            : 'text-slate-400 dark:text-white/30'
                      )}
                    >
                      {index + 1}
                    </span>
                  </td>

                  <td className="overflow-hidden px-2 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-6 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-white/10">
                        <img
                          src={standing.team.flag}
                          alt={`${standing.team.name} flag`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="truncate text-[13px] font-bold text-slate-900 dark:text-white/90">
                        {standing.team.name}
                      </span>
                    </div>
                  </td>

                  <td className={statCellClass}>{standing.played}</td>
                  <td className={statCellClass}>{standing.won}</td>
                  <td className={statCellClass}>{standing.drawn}</td>
                  <td className={statCellClass}>{standing.lost}</td>
                  <td className={statCellClass}>{standing.goalsFor}</td>
                  <td className={statCellClass}>{standing.goalsAgainst}</td>
                  <td
                    className={cn(
                      statCellClass,
                      'font-semibold',
                      standing.goalDifference > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : standing.goalDifference < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-500 dark:text-white/40'
                    )}
                  >
                    {standing.goalDifference > 0 ? '+' : ''}
                    {standing.goalDifference}
                  </td>
                  <td className="px-1 py-3.5 text-center text-sm font-black tabular-nums text-slate-950 dark:text-white">
                    {standing.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="relative grid grid-cols-1 gap-2 border-t border-slate-200/80 bg-slate-50/50 px-5 py-3 sm:grid-cols-2 dark:border-white/[0.06] dark:bg-black/10">
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
          <span className="text-[10px] leading-4 text-slate-500 dark:text-white/40">
            Vòng 32 đội <span className="text-slate-400 dark:text-white/25">(Hai đội đầu bảng)</span>
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.55)]" />
          <span className="text-[10px] leading-4 text-slate-500 dark:text-white/40">
            Hạng ba tốt nhất <span className="text-slate-400 dark:text-white/25">(8/12 đội)</span>
          </span>
        </div>
      </footer>
    </article>
  );
}
