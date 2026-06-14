'use client';

import { Trophy } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { getGroupColor } from '@/lib/group-colors';

// Types for our bracket
interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  score?: number;
  winner?: boolean;
}

interface Match {
  id: string;
  team1?: Team;
  team2?: Team;
  date?: string;
  status?: 'pending' | 'live' | 'finished';
}

interface MatchNode {
  match: Match;
  children?: MatchNode[];
}

const countries = [
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GER', name: 'Germany', flag: '🇩🇪' },
  { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
  { code: 'NED', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BEL', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CRO', name: 'Croatia', flag: '🇭🇷' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
];

// Deterministic data generator for the bracket tree with TBD teams
let nodeCounter = 0;
let leafCounter = 0;

const r32Matchups = [
  // Left Bracket (Matches 1-8)
  ["2nd Group A", "2nd Group B"],
  ["1st Group C", "2nd Group F"],
  ["1st Group E", "3rd Grp A/B/C/D/F"],
  ["1st Group F", "2nd Group C"],
  ["2nd Group E", "2nd Group I"],
  ["1st Group I", "3rd Grp C/D/F/G/H"],
  ["1st Group A", "3rd Grp C/E/F/H/I"],
  ["1st Group L", "3rd Grp E/H/I/J/K"],
  // Right Bracket (Matches 9-16)
  ["1st Group G", "3rd Grp A/E/H/I/J"],
  ["1st Group D", "3rd Grp B/E/F/I/J"],
  ["1st Group H", "2nd Group J"],
  ["2nd Group K", "2nd Group L"],
  ["1st Group B", "3rd Grp E/F/G/I/J"],
  ["2nd Group D", "2nd Group G"],
  ["1st Group J", "2nd Group H"],
  ["1st Group K", "3rd Grp D/E/I/J/L"],
];

const r32Dates = [
  'Jun 28, 2026 • 12:00', 'Jun 29, 2026 • 12:00', 'Jun 29, 2026 • 16:30', 'Jun 29, 2026 • 19:00',
  'Jun 30, 2026 • 12:00', 'Jun 30, 2026 • 17:00', 'Jun 30, 2026 • 19:00', 'Jul 1, 2026 • 12:00',
  'Jul 1, 2026 • 13:00', 'Jul 1, 2026 • 17:00', 'Jul 2, 2026 • 12:00', 'Jul 2, 2026 • 19:00',
  'Jul 2, 2026 • 20:00', 'Jul 3, 2026 • 13:00', 'Jul 3, 2026 • 18:00', 'Jul 3, 2026 • 20:30'
];
const r16Dates = [
  'Jul 4, 2026 • 12:00', 'Jul 4, 2026 • 17:00', 'Jul 5, 2026 • 16:00', 'Jul 5, 2026 • 18:00',
  'Jul 6, 2026 • 14:00', 'Jul 6, 2026 • 17:00', 'Jul 7, 2026 • 12:00', 'Jul 7, 2026 • 13:00'
];
const qfDates = [
  'Jul 9, 2026 • 16:00', 'Jul 10, 2026 • 12:00', 'Jul 11, 2026 • 17:00', 'Jul 11, 2026 • 20:00'
];
const sfDates = [
  'Jul 14, 2026 • 14:00', 'Jul 15, 2026 • 15:00'
];

let r16Counter = 0;
let qfCounter = 0;
let sfCounter = 0;

const createDummyNode = (level: number, prefix: string, side: 'left' | 'right'): MatchNode => {
  nodeCounter++;
  
  let team1Name = 'TBD';
  let team2Name = 'TBD';
  let date = 'TBD';
  
  if (level === 4) {
    const matchup = r32Matchups[leafCounter];
    team1Name = matchup[0];
    team2Name = matchup[1];
    date = r32Dates[leafCounter] || 'TBD';
    leafCounter++;
  } else if (level === 3) {
    team1Name = `Winner R32`;
    team2Name = `Winner R32`;
    date = r16Dates[r16Counter] || 'TBD';
    r16Counter++;
  } else if (level === 2) {
    team1Name = `Winner R16`;
    team2Name = `Winner R16`;
    date = qfDates[qfCounter] || 'TBD';
    qfCounter++;
  } else if (level === 1) {
    team1Name = `Winner QF`;
    team2Name = `Winner QF`;
    date = sfDates[sfCounter] || 'TBD';
    sfCounter++;
  }
  
  // No matches are finished yet
  const isFinished = false;
  const t1Score = undefined;
  const t2Score = undefined;
  
  const match: Match = {
    id: `${prefix}-${level}-${nodeCounter}`,
    date: date,
    status: 'pending',
    team1: {
      id: `t1-${prefix}-${level}-${nodeCounter}`,
      name: team1Name,
      code: team1Name,
      flag: '❔',
      score: t1Score,
      winner: isFinished && t1Score !== undefined && t2Score !== undefined ? t1Score > t2Score : undefined,
    },
    team2: {
      id: `t2-${prefix}-${level}-${nodeCounter}`,
      name: team2Name,
      code: team2Name,
      flag: '❔',
      score: t2Score,
      winner: isFinished && t1Score !== undefined && t2Score !== undefined ? t2Score > t1Score : undefined,
    }
  };

  if (level === 4) { // R32 is level 4 (leaf nodes)
    return { match };
  }

  return {
    match,
    children: [
      createDummyNode(level + 1, `${prefix}-c1`, side),
      createDummyNode(level + 1, `${prefix}-c2`, side),
    ]
  };
};

nodeCounter = 0;
leafCounter = 0;
const leftBracketTree = createDummyNode(1, 'l', 'left');   // Level 1 = SF

leafCounter = 0; // Reset for right side to have symmetric or different patterns if we want, but let's keep it continuous
const rightBracketTree = createDummyNode(1, 'r', 'right'); // Level 1 = SF

const finalMatch: Match = {
  id: 'final',
  date: 'July 19, 2026',
  status: 'pending',
  team1: { id: 'tf1', name: 'Winner SF1', code: 'W-SF1', flag: '❓' },
  team2: { id: 'tf2', name: 'Winner SF2', code: 'W-SF2', flag: '❓' }
};

const getTeamColorClass = (name: string | undefined) => {
  if (!name) return 'text-slate-300';
  const match = name.match(/(?:1st|2nd) Group ([A-L])/);
  if (match) {
    return getGroupColor(`Group ${match[1]}`).text;
  }
  return 'text-slate-300';
};

const MatchCard = ({ match, side, isFinal = false }: { match: Match, side: 'left' | 'right' | 'center', isFinal?: boolean }) => {
  return (
    <div className={`relative flex flex-col justify-center w-[160px] md:w-[180px] my-2 transition-all hover:scale-105 z-10
      ${isFinal ? 'w-[200px] md:w-[240px]' : ''}
    `}>
      <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border rounded-lg overflow-hidden shadow-xl
        ${isFinal ? 'border-amber-500/50 shadow-amber-500/20' : 'border-slate-700/60 hover:border-fuchsia-500/50'}
      `}>
        {/* Match Header */}
        <div className="flex justify-between items-center px-2 py-1 bg-black/50 text-[10px] text-slate-400 border-b border-slate-700/50">
          <span>{match.date}</span>
          <span className="uppercase">{match.status}</span>
        </div>
        
        {/* Team 1 */}
        <div className={`flex items-center justify-between px-3 py-2 border-b border-slate-700/50 bg-slate-800/40
          ${match.team1?.winner ? 'font-bold' : ''}
        `}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{match.team1?.flag}</span>
            <span className={`text-xs truncate max-w-[60px] md:max-w-[80px] font-semibold ${getTeamColorClass(match.team1?.name)}`}>
              {match.team1?.code}
            </span>
          </div>
          <span className={`text-sm font-semibold ${match.team1?.winner ? 'text-white' : 'text-slate-300'}`}>{match.team1?.score ?? '-'}</span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between px-3 py-2 bg-slate-800/40
          ${match.team2?.winner ? 'font-bold' : ''}
        `}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{match.team2?.flag}</span>
            <span className={`text-xs truncate max-w-[60px] md:max-w-[80px] font-semibold ${getTeamColorClass(match.team2?.name)}`}>
              {match.team2?.code}
            </span>
          </div>
          <span className={`text-sm font-semibold ${match.team2?.winner ? 'text-white' : 'text-slate-300'}`}>{match.team2?.score ?? '-'}</span>
        </div>
      </div>
    </div>
  );
};

const BracketNodeComponent = ({ node, side }: { node: MatchNode, side: 'left' | 'right' }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
      
      {/* Children Container */}
      {hasChildren && (
        <div className="flex flex-col justify-center">
          {node.children!.map((child, index) => (
            <div key={child.match.id} className={`relative flex items-center ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
              
              <BracketNodeComponent node={child} side={side} />
              
              {/* Horizontal line extending from child MatchCard to the vertical spine */}
              <div className="w-8 border-t-2 border-slate-600/50 z-0" />

              {/* Vertical line segment drawing the spine */}
              <div className={`absolute w-0 border-slate-600/50 z-0
                ${side === 'left' ? 'border-r-2 right-0' : 'border-l-2 left-0'}
                ${index === 0 ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'}
              `} />
              
            </div>
          ))}
        </div>
      )}

      {/* Horizontal line from the vertical spine to the parent MatchCard */}
      {hasChildren && (
        <div className="w-8 border-t-2 border-slate-600/50 z-0" />
      )}

      {/* The Match Card itself */}
      <div className={`flex flex-col justify-center px-4 relative z-10 ${!hasChildren ? (side === 'left' ? 'pr-8' : 'pl-8') : ''}`}>
        <MatchCard match={node.match} side={side} />
      </div>

    </div>
  );
};

export default function BracketPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 p-4 md:p-8 w-full max-w-[1800px] mx-auto min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#060212]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl shadow-lg shadow-fuchsia-500/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            {t('nav.bracket')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-white/50 mt-1">
            {t('bracket.subtitle')}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-slate-100/50 dark:bg-[#0a061a]/50 rounded-2xl border border-slate-200 dark:border-white/5 p-4 md:p-8">
        <div className="w-[max-content] min-w-full mx-auto flex justify-center items-center gap-0 px-8">
          
          {/* Left Side Tree */}
          <BracketNodeComponent node={leftBracketTree} side="left" />

          {/* Center (Final) */}
          <div className="flex flex-col justify-center items-center relative min-w-[300px] px-8">
             {/* Lines connecting SF to Final */}
             <div className="absolute left-0 w-[50%] top-1/2 border-t-2 border-slate-600/50 z-0" />
             <div className="absolute right-0 w-[50%] top-1/2 border-t-2 border-slate-600/50 z-0" />
             
             <div className="mb-10 relative">
               <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
               <Trophy className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative z-10" />
             </div>
             <MatchCard match={finalMatch} side="center" isFinal />
             <div className="mt-6 px-8 py-2.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold text-sm tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]">
               World Champion
             </div>
          </div>

          {/* Right Side Tree */}
          <BracketNodeComponent node={rightBracketTree} side="right" />

        </div>
      </div>
    </div>
  );
}
