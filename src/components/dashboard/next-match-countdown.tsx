'use client';

import { useState, useEffect } from 'react';
import { MatchCard } from './match-card';
import type { Match } from '@/types/football';
import { Clock, MapPin, Users, Thermometer } from 'lucide-react';
import { TVScoreboard } from './tv-scoreboard';

interface Props {
  nextMatch: Match;
  onLive: () => void;
}

export function NextMatchCountdown({ nextMatch, onLive }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const matchTime = new Date(nextMatch.date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = matchTime - now;

      if (difference <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        onLive();
      } else {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextMatch, onLive]);

  if (!timeLeft) return null;

  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    // The match is live now! We show the match card with live status
    const liveMatch: Match = { ...nextMatch, status: 'live' };
    return <MatchCard match={liveMatch} />;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 text-center shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.025] lg:p-6">
      <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[60px]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">Trận tiếp theo bắt đầu sau</span>
        </div>

        <div className="mb-6 grid w-full max-w-lg grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-3xl lg:text-4xl font-mono font-bold text-slate-900 dark:text-white">{String(timeLeft.d).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest mt-1">Ngày</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl lg:text-4xl font-mono font-bold text-slate-900 dark:text-white">{String(timeLeft.h).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest mt-1">Giờ</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl lg:text-4xl font-mono font-bold text-slate-900 dark:text-white">{String(timeLeft.m).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest mt-1">Phút</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl lg:text-4xl font-mono font-bold text-slate-900 dark:text-white">{String(timeLeft.s).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest mt-1">Giây</span>
          </div>
        </div>

        {/* Sneak peek of the match */}
        <div className="w-full max-w-sm mx-auto">
          <TVScoreboard match={nextMatch} compact={true} />
          
          <div className="flex flex-col gap-2 mt-4 text-[11px] text-slate-600 dark:text-white/40">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                <span>{nextMatch.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(nextMatch.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {(nextMatch.attendance || nextMatch.weather) && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {nextMatch.attendance && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    <span>{nextMatch.attendance}</span>
                  </div>
                )}
                {nextMatch.weather && (
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="h-3 w-3" />
                    <span>{nextMatch.weather}</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
