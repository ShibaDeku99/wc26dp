import type { Standing } from '@/types/football';
import { cn } from '@/lib/utils';
import { getGroupColor } from '@/lib/group-colors';
import { TeamBadge } from '@/components/shared/team-badge';

interface StandingsTableProps {
  standings: Standing[];
  groupName: string;
  highlightTop?: number;
}

export function StandingsTable({ standings, groupName, highlightTop = 2 }: StandingsTableProps) {
  const colors = getGroupColor(groupName);

  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br from-white/[0.04] to-white/[0.01] overflow-hidden", colors.border)}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h3 className={cn("text-sm font-bold", colors.text)}>{groupName}</h3>
        <span className="text-[10px] text-slate-500 dark:text-white/30">
          {standings.reduce((acc, s) => acc + s.played, 0)} matches played
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5">
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">#</th>
              <th className="text-left px-2 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider">Team</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">P</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">W</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">D</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-6">L</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7 hidden sm:table-cell">GF</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7 hidden sm:table-cell">GA</th>
              <th className="text-center px-1 py-2.5 text-[10px] font-semibold text-slate-500 dark:text-white/30 uppercase tracking-wider w-7">GD</th>
              <th className="text-center px-1.5 py-2.5 text-[10px] font-semibold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wider w-8">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
                <tr
                key={standing.team.id}
                className={cn(
                  'border-b border-slate-200 dark:border-white/[0.03] transition-colors hover:bg-slate-100 dark:bg-white/[0.03]',
                  index < 2 && 'bg-emerald-500/[0.04]',
                  index === 2 && 'bg-cyan-500/[0.04]'
                )}
              >
                <td className="px-2 py-2.5">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                    index < 2
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : index === 2 
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400'
                        : 'text-slate-500 dark:text-white/30'
                  )}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-2 py-2.5 w-full max-w-[90px] xl:max-w-[120px] overflow-hidden">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={standing.team.flag}
                      alt={standing.team.name}
                      className="h-4 w-6 rounded-sm object-cover flex-shrink-0"
                    />
                    <span className="font-medium text-xs truncate">
                      {standing.team.name}
                    </span>
                  </div>
                </td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs">{standing.played}</td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs">{standing.won}</td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs">{standing.drawn}</td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs">{standing.lost}</td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs hidden sm:table-cell">{standing.goalsFor}</td>
                <td className="text-center px-1 py-2.5 text-slate-600 dark:text-white/50 text-xs hidden sm:table-cell">{standing.goalsAgainst}</td>
                <td className={cn(
                  'text-center px-1 py-2.5 text-xs font-medium',
                  standing.goalDifference > 0 ? 'text-emerald-700 dark:text-emerald-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-slate-600 dark:text-white/40'
                )}>
                  {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                </td>
                <td className="text-center px-1.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white">
                  {standing.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-slate-600 dark:text-white/40">Advance to Round of 32 (Top 2)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-slate-600 dark:text-white/40">Possible advance (Best 8 of 12 Third-place)</span>
        </div>
      </div>
    </div>
  );
}
