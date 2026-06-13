import type { Group } from '@/types/football';
import { TeamBadge } from '@/components/shared/team-badge';
import { Users } from 'lucide-react';
import { getGroupColor } from '@/lib/group-colors';
import { cn } from '@/lib/utils';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const colors = getGroupColor(group.name);

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition-all duration-300 hover:shadow-lg",
      colors.border,
      colors.hoverBorder,
      colors.shadow
    )}>
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
            <Users className={cn("h-4 w-4", colors.text)} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{group.name}</h3>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">{group.teams.length} teams</span>
      </div>

      {/* Teams */}
      <div className="p-4 space-y-3">
        {group.teams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center justify-between group/item py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-white/20 font-mono w-4">{index + 1}</span>
              <TeamBadge team={team} size="sm" />
            </div>
            <span className="text-xs text-slate-500 dark:text-white/30 font-medium tracking-wider">{team.code}</span>
          </div>
        ))}
      </div>

      {/* Decorative gradient */}
      <div className={cn("absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity", colors.bg)} />
    </div>
  );
}
