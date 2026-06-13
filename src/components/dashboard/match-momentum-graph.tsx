"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Label } from 'recharts';
import type { MatchEvent } from '@/types/football';

interface MatchMomentumGraphProps {
  graphPoints: { minute: number; value: number }[];
  homeTeamName: string;
  awayTeamName: string;
  events?: MatchEvent[];
}

export function MatchMomentumGraph({ graphPoints, homeTeamName, awayTeamName, events }: MatchMomentumGraphProps) {
  if (!graphPoints || graphPoints.length === 0) {
    return null;
  }

  // Premium Neon Colors
  const HOME_COLOR = "#38bdf8"; // Neon Sky Blue
  const AWAY_COLOR = "#fb7185"; // Neon Rose

  const CustomGoalLabel = (props: any) => {
    // Recharts passes x and y based on the 'position' prop of Label
    const { x, y, team } = props;
    // Use emerald green for all goals like Sofascore, or keep team colors.
    // The user showed green balls, let's use Emerald 500 (#22c55e)
    const color = "#22c55e"; 
    
    // Adjust y slightly to ensure it's fully visible and not cut off
    const yOffset = team === 'home' ? 5 : -5;
    
    return (
      <g transform={`translate(${x - 8}, ${y + yOffset})`} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <circle cx="8" cy="8" r="7" fill="#0B1021" stroke={color} strokeWidth="1.5" />
        <path d="M8 8 l2 -1.5 l-0.5 -3 l-3 0 l-0.5 3 l2 1.5 z" fill={color} />
        <path d="M10 6.5 l3 -1 M7.5 3.5 l-1.5 -3 M5.5 9.5 l-3 1 M9 9.5 l1.5 3 M8 8 l0 3.5" stroke={color} strokeWidth="1" />
      </g>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-5 overflow-hidden">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          Match Momentum
        </span>
        <div className="flex items-center gap-4 text-xs font-normal">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
            <span className="text-slate-700 dark:text-white/60">{homeTeamName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#fb7185] shadow-[0_0_8px_rgba(251,113,133,0.5)]"></div>
            <span className="text-slate-700 dark:text-white/60">{awayTeamName}</span>
          </div>
        </div>
      </h3>
      
      <div className="h-[220px] w-full mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={graphPoints}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barCategoryGap="0%"
            barGap={0}
          >
            <defs>
              <linearGradient id="homeGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="awayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#be123c" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#fb7185" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="minute" 
              tick={{ fill: '#ffffff', opacity: 0.3, fontSize: 10, fontFamily: 'monospace' }} 
              tickLine={false} 
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
              dy={10}
            />
            <YAxis hide domain={[-100, 100]} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const isHome = data.value > 0;
                  const color = isHome ? HOME_COLOR : AWAY_COLOR;
                  const team = isHome ? homeTeamName : awayTeamName;
                  return (
                    <div className="bg-[#0B1021]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-2xl text-xs flex flex-col gap-1 z-50 relative">
                      <div className="text-slate-600 dark:text-white/40 font-mono text-[10px]">MINUTE {data.minute}'</div>
                      <div className="font-semibold flex items-center gap-2 text-slate-800 dark:text-white/90">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
                        {team} Pressure
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            
            {/* Draw Goal Markers */}
            {events?.filter(e => e.type === 'goal').map((goal, idx) => (
              <ReferenceLine 
                key={`goal-${idx}`} 
                x={goal.time} 
                stroke="rgba(255,255,255,0.15)" 
                strokeDasharray="3 3"
              >
                <Label 
                  content={<CustomGoalLabel team={goal.team} />} 
                  position={goal.team === 'home' ? 'insideTop' : 'insideBottom'}
                />
              </ReferenceLine>
            ))}

            <Bar dataKey="value" isAnimationActive={true}>
              {
                graphPoints.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value > 0 ? "url(#homeGrad)" : "url(#awayGrad)"} 
                  />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
