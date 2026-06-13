import { Trophy } from 'lucide-react';
import type { Match } from '@/types/football';
import { cn } from '@/lib/utils';
import { getTeamKitColor } from '@/lib/team-colors';

interface TVScoreboardProps {
  match: Match;
  compact?: boolean;
}

export function TVScoreboard({ match, compact = false }: TVScoreboardProps) {
  const homeScore = match.homeScore ?? (match.status === 'scheduled' ? '-' : 0);
  const awayScore = match.awayScore ?? (match.status === 'scheduled' ? '-' : 0);
  
  const matchDate = new Date(match.date);
  const timeStr = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Sizes based on compact prop
  const wrapperH = compact ? "h-8" : "h-14";
  const teamPx = compact ? "px-2 sm:px-3" : "px-5";
  const flagSize = compact ? "w-5 h-3.5 sm:w-6 sm:h-4" : "w-8 h-5";
  const dotSize = compact ? "w-1 h-1 sm:w-1.5 sm:h-1.5" : "w-2.5 h-2.5";
  const teamText = compact ? "text-[13px] sm:text-base mt-0.5" : "text-3xl mt-1";
  const scorePx = compact ? "px-2 sm:px-3 min-w-[1.75rem] sm:min-w-[2.5rem]" : "px-4 min-w-[3.5rem]";
  const scoreText = compact ? "text-lg sm:text-xl" : "text-4xl";
  const logoW = compact ? "w-6 sm:w-8" : "w-12";
  const logoBox = compact ? "w-8 h-10 sm:w-10 sm:h-12 rounded-lg sm:rounded-[0.75rem] border-[1.5px] sm:border-[2px]" : "w-16 h-20 rounded-[1.25rem] border-[3px]";
  const logoIcon = compact ? "w-3 h-3 sm:w-4 sm:h-4" : "w-7 h-7";
  const logoText = compact ? "text-[5px] sm:text-[6px] mt-0.5" : "text-[9px] mt-0.5";
  const timePx = compact ? "px-2 sm:px-4" : "px-5";
  const timeText = compact ? "text-[11px] sm:text-[13px] mt-0.5 font-bold" : "text-2xl mt-1";
  const borderB = compact ? "border-b-2" : "border-b-4";

  const homeColor = getTeamKitColor(match.homeTeam.name, true);
  const awayColor = getTeamKitColor(match.awayTeam.name, false);

  return (
    <div className={cn("flex items-center justify-center font-sans select-none overflow-visible py-3 sm:py-4 w-full", !compact && "scale-90 sm:scale-100")}>
      <div className={cn("flex items-stretch shadow-xl sm:shadow-2xl relative rounded-2xl sm:rounded-[2rem] overflow-visible max-w-full", wrapperH)}>
        
        {/* Home Team */}
        <div 
          className={cn("flex items-center rounded-l-2xl sm:rounded-l-[2rem] relative z-10 gap-1.5 sm:gap-2 lg:gap-3", teamPx, borderB, "border-rose-400")}
          style={{ backgroundColor: homeColor.bg, color: homeColor.text }}
        >
          {match.homeTeam.flag ? (
            <img src={match.homeTeam.flag} alt={match.homeTeam.name} className={cn("object-cover rounded-[2px]", flagSize)} />
          ) : (
            <div className={cn("bg-zinc-800 rounded-[2px]", flagSize)} />
          )}
          <div className={cn("rounded-full bg-blue-300 ring-2 ring-white/10 hidden sm:block", dotSize)} />
          <span className={cn("font-black tracking-wider leading-none", teamText)}>{match.homeTeam.code}</span>
        </div>

        {/* Home Score */}
        <div className={cn("flex items-center justify-center bg-[#43edd4] relative z-20", scorePx)}>
          <span className={cn("font-black text-black leading-none", scoreText)}>{homeScore}</span>
        </div>

        {/* Center Logo */}
        <div className={cn("relative z-30 flex items-center justify-center", logoW)}>
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f0f0f] flex flex-col items-center justify-center shadow-2xl border-black overflow-hidden", logoBox)}>
            <img src="https://photo2.tinhte.vn/data/attachment-files/2023/05/6433988_image.jpg" alt="FIFA" className="w-full h-full object-cover scale-[1.2]" />
          </div>
        </div>

        {/* Away Score */}
        <div className={cn("flex items-center justify-center bg-[#43edd4] relative z-20", scorePx)}>
          <span className={cn("font-black text-black leading-none", scoreText)}>{awayScore}</span>
        </div>

        {/* Away Team */}
        <div 
          className={cn("flex items-center relative z-10 gap-1.5 sm:gap-2 lg:gap-3", teamPx, borderB, "border-lime-400")}
          style={{ backgroundColor: awayColor.bg, color: awayColor.text }}
        >
          <span className={cn("font-black tracking-wider leading-none", teamText)}>{match.awayTeam.code}</span>
          <div className={cn("rounded-full bg-indigo-800 ring-2 ring-white/10 hidden sm:block", dotSize)} />
          {match.awayTeam.flag ? (
            <img src={match.awayTeam.flag} alt={match.awayTeam.name} className={cn("object-cover rounded-[2px]", flagSize)} />
          ) : (
            <div className={cn("bg-zinc-800 rounded-[2px]", flagSize)} />
          )}
        </div>

        {/* Time */}
        <div className={cn("flex items-center justify-center bg-white rounded-r-2xl sm:rounded-r-[2rem] relative z-0", timePx, borderB, "border-purple-300")}>
          <span className={cn("font-black text-black leading-none whitespace-nowrap", timeText)}>
            {match.status === 'live' ? 'LIVE' : match.status === 'finished' ? 'FT' : timeStr}
          </span>
        </div>

      </div>
    </div>
  );
}
