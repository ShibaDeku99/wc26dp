import Link from 'next/link';
import type { Match } from '@/types/football';
import { StatusBadge } from '@/components/shared/status-badge';
import { TeamBadge } from '@/components/shared/team-badge';
import { MapPin, Clock, ArrowRight, Users, Thermometer } from 'lucide-react';
import { TVScoreboard } from '@/components/dashboard/tv-scoreboard';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}


const TEAM_HUES: Record<string, number> = {
  // Americas
  'Argentina': 200, 'Brazil': 50, 'USA': 230, 'Mexico': 140, 'Canada': 355, 
  'Uruguay': 200, 'Colombia': 45, 'Ecuador': 50, 'Peru': 0, 'Chile': 0, 'Haiti': 220,
  
  // Europe
  'France': 220, 'England': 0, 'Spain': 5, 'Germany': 40, 'Portugal': 0, 
  'Italy': 210, 'Netherlands': 25, 'Croatia': 0, 'Belgium': 0, 'Switzerland': 355, 
  'Wales': 0, 'Poland': 355, 'Denmark': 0, 'Scotland': 220, 'Turkey': 355, 'Sweden': 50,
  
  // Asia & Oceania
  'Japan': 220, 'South Korea': 350, 'Australia': 45, 'Saudi Arabia': 130, 'Iran': 120,
  
  // Africa
  'Senegal': 125, 'Morocco': 350, 'Cameroon': 130, 'Ghana': 20
};

const getTeamHue = (teamName: string) => {
  if (!teamName) return 0;
  
  // Return hardcoded realistic color if available
  const match = Object.keys(TEAM_HUES).find(k => teamName.toLowerCase().includes(k.toLowerCase()));
  if (match) return TEAM_HUES[match];

  // Fallback to deterministic hash
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const matchDate = new Date(match.date);
  const timeStr = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const homeHue = getTeamHue(match.homeTeam.name);
  const awayHue = getTeamHue(match.awayTeam.name);

  return (
    <Link
      href={`/matches/${match.id}`}
      style={{ 
        '--card-border': `hsla(${homeHue}, 80%, 50%, 0.4)`,
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
      } as React.CSSProperties}
      className="group relative overflow-hidden block rounded-2xl border border-slate-300 dark:border-white/[0.08] dark:border-t-white/[0.15] border-t-white/60 hover:border-[var(--card-border)] p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] backdrop-blur-xl bg-white/10 dark:bg-black/10"
    >
      {/* Glossy sheen overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/20 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Dynamic Team Colors Background Gradient */}
      <div className="absolute inset-0 z-0 dark:hidden transition-opacity duration-300 opacity-80 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, hsla(${homeHue}, 85%, 65%, 0.15), hsla(${awayHue}, 85%, 65%, 0.15))` }} />
      <div className="absolute inset-0 z-0 hidden dark:block transition-opacity duration-300 opacity-60 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, hsla(${homeHue}, 80%, 40%, 0.2), hsla(${awayHue}, 80%, 40%, 0.2))` }} />



      <div className="relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className="text-[10px] font-semibold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wider">
              {match.group}
            </span>
          )}
          <span className="text-[10px] text-slate-500 dark:text-white/20">•</span>
          <span className="text-[10px] text-slate-500 dark:text-white/30">{match.round}</span>
        </div>
        <StatusBadge status={match.status} liveMinute={match.liveMinute} />
      </div>

      {/* Teams & Score via TV Scoreboard */}
      <div className="py-2">
        <TVScoreboard match={match} compact={true} />
      </div>

      {/* Bottom bar */}
      {!compact && (
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{match.venue}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{dateStr} • {timeStr}</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 dark:text-white/20 group-hover:text-emerald-700 dark:text-emerald-400 transition-colors" />
          </div>
          
          {(match.attendance || match.weather) && (
            <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-white/30 pt-1">
              {match.attendance && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3" />
                  <span>{match.attendance}</span>
                </div>
              )}
              {match.weather && (
                <div className="flex items-center gap-1.5">
                  <Thermometer className="h-3 w-3" />
                  <span>{match.weather}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </Link>
  );
}
