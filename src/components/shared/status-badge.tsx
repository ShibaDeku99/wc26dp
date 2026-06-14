import type { MatchStatus } from '@/types/football';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: MatchStatus;
  liveMinute?: number;
  className?: string;
}

export function StatusBadge({ status, liveMinute, className = '' }: StatusBadgeProps) {
  const config: Record<MatchStatus, { label: string; classes: string }> = {
    scheduled: {
      label: 'Scheduled',
      classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
    },
    live: {
      label: liveMinute !== undefined ? `● ${liveMinute}'` : '● LIVE',
      classes: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 animate-pulse hover:bg-emerald-500/30',
    },
    finished: {
      label: 'Finished',
      classes: 'bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30',
    },
    postponed: {
      label: 'Postponed',
      classes: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
    },
  };

  const { label, classes } = config[status] || config.scheduled;

  return (
    <Badge
      variant="outline"
      className={`${classes} text-[11px] font-semibold tracking-wide uppercase ${className}`}
    >
      {label}
    </Badge>
  );
}
