import type { Team } from '@/types/football';

interface TeamBadgeProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showCode?: boolean;
}

export function TeamBadge({ team, size = 'md', showName = true, showCode = false }: TeamBadgeProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      {team.flag.startsWith('http') || team.flag.startsWith('/') ? (
        <img
          src={team.flag}
          alt={team.name}
          className={`${size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-7 w-7' : 'h-10 w-10'} rounded-full object-cover`}
        />
      ) : (
        <span className={sizeClasses[size]} role="img" aria-label={team.name}>
          {team.flag}
        </span>
      )}
      {showName && (
        <span className={`font-medium ${textSizes[size]}`}>
          {team.name}
        </span>
      )}
      {showCode && !showName && (
        <span className={`font-bold ${textSizes[size]} tracking-wide`}>
          {team.code}
        </span>
      )}
    </div>
  );
}
