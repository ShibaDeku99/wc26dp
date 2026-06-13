"use client";

import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchLineupsProps {
  lineups: any;
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchLineups({ lineups, homeTeamName, awayTeamName }: MatchLineupsProps) {
  if (!lineups || !lineups.home || !lineups.away) {
    console.log("LINEUPS IS MISSING OR INVALID:", lineups);
    return null;
  }
  
  console.log("LINEUPS HOME KEYS:", Object.keys(lineups.home));
  if (lineups.home.players) console.log("HOME PLAYERS:", lineups.home.players.length);

  const renderListTeam = (team: any, name: string, isHome: boolean) => {
    let starters: any[] = [];
    let formation = 'N/A';

    if (Array.isArray(team)) {
      starters = team.map((pStr: string, idx: number) => {
        const parts = pStr.split(' - ');
        return { shirtNumber: parts[0] || '?', player: { name: (parts[1] || '').replace(/\(.*\)/, '').trim() } };
      });
    } else if (team && team.players) {
      formation = team.formation || 'N/A';
      starters = team.players.filter((p: any) => !p.substitute);
      if (starters.length === 0) starters = team.players.slice(0, 11);
    }

    return (
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 mb-3 ${isHome ? '' : 'flex-row-reverse text-right'}`}>
          <div className={`w-2 h-2 rounded-sm ${isHome ? 'bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-[#fb7185] shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`}></div>
          <div className="flex-1 min-w-0">
            <h4 className="text-slate-800 dark:text-white/90 font-bold text-xs uppercase truncate">{name}</h4>
            {formation !== 'N/A' && <div className="text-slate-600 dark:text-white/40 text-[10px] font-mono mt-0.5">{formation}</div>}
          </div>
        </div>
        <div className="space-y-1 bg-slate-100 dark:bg-white/[0.02] rounded-xl p-3 border border-slate-200 dark:border-white/[0.04] h-full min-h-[150px]">
          {starters.length > 0 ? starters.map((p: any, idx: number) => (
            <div key={idx} className={`flex items-center gap-2 text-xs ${isHome ? '' : 'flex-row-reverse'}`}>
              <div className="w-5 text-center font-mono text-[10px] text-slate-500 dark:text-white/30">{p.shirtNumber}</div>
              <div className={`font-medium text-slate-800 dark:text-white/80 truncate flex-1 ${!isHome && 'text-right'}`}>{p.player.shortName || p.player.name}</div>
            </div>
          )) : (
            <div className="text-slate-500 dark:text-white/30 text-xs italic text-center py-4">Lineup not available</div>
          )}
        </div>
      </div>
    );
  };

  const renderPitchTeam = (team: any, isHome: boolean) => {
    let starters = team.players?.filter((p: any) => !p.substitute) || [];
    if (starters.length === 0) starters = team.players?.slice(0, 11) || [];
    
    const lines = (team.formation || '').split('-').map(Number).filter((n: number) => !isNaN(n));
    const gk = starters[0] || {};
    const outfield = starters.slice(1);
    
    const rows: any[][] = [];
    let currentIndex = 0;
    lines.forEach((count: number) => {
      rows.push(outfield.slice(currentIndex, currentIndex + count));
      currentIndex += count;
    });
    if (currentIndex < outfield.length) rows.push(outfield.slice(currentIndex));

    // For Home (Bottom Half), rows go from Bottom to Top (GK -> DEF -> MID -> FWD)
    // For Away (Top Half), rows go from Top to Bottom (GK -> DEF -> MID -> FWD)
    const finalRows = [ [gk], ...rows ];
    
    return (
      <div className={`flex flex-1 ${isHome ? 'flex-col-reverse' : 'flex-col'} justify-evenly relative z-10 w-full py-4`}>
        {finalRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-around items-center w-full px-2 sm:px-8">
            {row.map((p: any, pIdx: number) => (
              <div key={pIdx} className="flex flex-col items-center justify-center group relative z-20 hover:z-30 cursor-pointer transition-all duration-300"
                   style={{ transform: 'rotateX(-45deg)', transformOrigin: 'bottom' }}>
                
                {/* 3D Player Marker */}
                <div className="relative">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-400 dark:border-white/50 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.6)] text-xs sm:text-sm font-bold text-slate-900 dark:text-white transition-transform group-hover:scale-110 group-hover:-translate-y-2",
                    isHome ? "bg-gradient-to-t from-[#0284c7] to-[#38bdf8]" : "bg-gradient-to-t from-[#e11d48] to-[#fb7185]"
                  )}>
                    {p.shirtNumber}
                  </div>
                  {/* Fake shadow underneath to enhance 3D popping effect */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/60 blur-[3px] rounded-full pointer-events-none transition-transform group-hover:scale-75 group-hover:translate-y-2"></div>
                </div>

                <div className="mt-2 bg-[#0B1021]/95 px-2 py-1 rounded-md text-[9px] sm:text-[11px] font-medium text-slate-800 dark:text-white/95 text-center whitespace-nowrap max-w-[70px] sm:max-w-[90px] truncate shadow-[0_5px_15px_rgba(0,0,0,0.5)] border border-slate-300 dark:border-white/20 group-hover:bg-[#0B1021] group-hover:border-slate-400 dark:border-white/40 group-hover:text-slate-900 dark:text-white transition-all">
                  {p.player?.shortName || p.player?.name || 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const hasFormations = lineups.home?.formation && lineups.away?.formation;

  return (
    <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-[#0B1021] p-5 mb-6 overflow-hidden relative shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          Starting Lineups <span className="text-slate-500 dark:text-white/30 text-xs font-normal ml-1">(3D View)</span>
        </h3>
        {lineups.confirmed && (
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Confirmed
          </span>
        )}
      </div>
      
      {hasFormations ? (
        <div className="relative w-full h-[600px] sm:h-[750px] mx-auto overflow-visible" style={{ perspective: '1200px' }}>
          
          {/* The 3D Pitched Background */}
          <div className="absolute inset-0 bg-[#16271c] rounded-2xl border-4 border-slate-300 dark:border-white/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col"
               style={{ transform: 'rotateX(45deg) scale(0.9)', transformOrigin: 'center 70%', transformStyle: 'preserve-3d' }}>
            
            {/* Turf pattern (Grass stripes) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, #fff 10%, #fff 20%)' }}>
            </div>

            {/* Field Lines */}
            {/* Center line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-400 dark:bg-white/30 -translate-y-1/2"></div>
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full border-[3px] border-slate-400 dark:border-white/30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-slate-400 dark:bg-white/50 -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Top Penalty Box (Away) */}
            <div className="absolute top-0 left-[20%] right-[20%] h-[15%] border-b-[3px] border-x-[3px] border-slate-400 dark:border-white/30"></div>
            {/* Top 6-yard Box */}
            <div className="absolute top-0 left-[35%] right-[35%] h-[5%] border-b-[3px] border-x-[3px] border-slate-400 dark:border-white/30"></div>
            {/* Top Penalty Arc */}
            <div className="absolute top-[15%] left-1/2 w-16 h-8 sm:w-24 sm:h-12 border-b-[3px] border-x-[3px] border-slate-400 dark:border-white/30 rounded-b-full -translate-x-1/2"></div>

            {/* Bottom Penalty Box (Home) */}
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[15%] border-t-[3px] border-x-[3px] border-slate-400 dark:border-white/30"></div>
            {/* Bottom 6-yard Box */}
            <div className="absolute bottom-0 left-[35%] right-[35%] h-[5%] border-t-[3px] border-x-[3px] border-slate-400 dark:border-white/30"></div>
            {/* Bottom Penalty Arc */}
            <div className="absolute bottom-[15%] left-1/2 w-16 h-8 sm:w-24 sm:h-12 border-t-[3px] border-x-[3px] border-slate-400 dark:border-white/30 rounded-t-full -translate-x-1/2"></div>

            {/* Render Players in the 3D Space */}
            <div className="absolute inset-0 flex flex-col z-10">
              {renderPitchTeam(lineups.away, false)} {/* Away is TOP half */}
              {renderPitchTeam(lineups.home, true)}  {/* Home is BOTTOM half */}
            </div>

          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-stretch">
          {renderListTeam(lineups.home, homeTeamName, true)}
          {renderListTeam(lineups.away, awayTeamName, false)}
        </div>
      )}
    </div>
  );
}
