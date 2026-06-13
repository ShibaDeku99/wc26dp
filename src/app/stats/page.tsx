'use client';

import { 
  Flame, 
  Target, 
  Shield, 
  TrendingUp, 
  Medal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeamBadge } from '@/components/shared/team-badge';

import { useQuery } from '@tanstack/react-query';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';

const SoccerBallIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12l3-2.5-1-4-4 1-1 4 3 2.5z" />
    <path d="M12 12l3 4.5" />
    <path d="M15 9.5l4-1" />
    <path d="M10 9.5l-4-1" />
    <path d="M9 12l-3 4.5" />
  </svg>
);

const ShoeAssistIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 16v-2.5c0-1.5 1-2.5 2.5-2.5h2c.5 0 1-.5 1-1v-1c0-.5.5-1 1-1h1.5" />
    <path d="M12 8l4.5 3.5c1 .8 2.5.8 3.5 0l2-1.5" />
    <path d="M4 16h14c1.5 0 2.5 1 2.5 2.5v.5H4v-3z" />
    <circle cx="20" cy="8" r="2" />
  </svg>
);

const GoalNetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 22V6c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v16" />
    <path d="M4 10h16" />
    <path d="M4 14h16" />
    <path d="M4 18h16" />
    <path d="M8 4v18" />
    <path d="M12 4v18" />
    <path d="M16 4v18" />
  </svg>
);
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface TopPlayerItem {
  id: string;
  name: string;
  team: { id: string; name: string; code: string; flag: string };
  stat: number;
  subtitle: string;
  imageUrl: string;
}

interface PlayerLeaderboardProps {
  title: string;
  icon: React.ElementType;
  data: TopPlayerItem[];
  theme: 'emerald' | 'amber' | 'cyan';
  statLabel: string;
}



function PlayerLeaderboard({ title, icon: Icon, data, theme, statLabel }: PlayerLeaderboardProps) {
  const themeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  };

  const gradientStyles = {
    emerald: 'from-emerald-500/5 to-transparent',
    amber: 'from-amber-500/5 to-transparent',
    cyan: 'from-cyan-500/5 to-transparent',
  };

  return (
    <div className={cn("rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-gradient-to-b overflow-hidden", gradientStyles[theme])}>
      {/* Header */}
      <div className="p-5 border-b border-slate-300 dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", themeStyles[theme])}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-[11px] text-slate-600 dark:text-white/40 uppercase tracking-wider">{statLabel} Leaders</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.04] relative">
        {data && data.length > 0 ? (
          (() => {
            const maxStat = Math.max(...data.map(d => d.stat), 1);
            return data.map((player, index) => (
              <div 
                key={player.id} 
                className="relative flex items-center justify-between p-4 hover:bg-slate-100 dark:bg-white/[0.04] transition-colors group overflow-hidden"
              >
                {/* Horizontal Bar Chart Background */}
                <div 
                  className={cn(
                    "absolute top-0 bottom-0 left-0 opacity-10 group-hover:opacity-20 transition-all duration-1000 ease-out", 
                    theme === 'emerald' ? 'bg-emerald-500' : theme === 'amber' ? 'bg-amber-500' : 'bg-cyan-500'
                  )}
                  style={{ width: `${(player.stat / maxStat) * 100}%` }}
                />
                
                {/* Vertical Indicator Line */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5",
                  index === 0 ? (theme === 'emerald' ? 'bg-emerald-500' : theme === 'amber' ? 'bg-amber-500' : 'bg-cyan-500') : "bg-transparent"
                )} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn(
                    "w-6 text-center font-bold text-sm",
                    index === 0 ? "text-amber-700 dark:text-amber-400" : 
                    index === 1 ? "text-slate-300" : 
                    index === 2 ? "text-amber-600" : "text-slate-500 dark:text-white/30"
                  )}>
                    {index === 0 ? <Medal className="w-5 h-5 mx-auto" /> : index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={player.imageUrl} 
                      alt={player.name} 
                      className="w-full h-full object-cover bg-slate-100 dark:bg-white/[0.02]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${player.name}&backgroundColor=0a0f1c&textColor=ffffff`;
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-700 dark:text-emerald-400 transition-colors">{player.name}</h3>
                    <TeamBadge team={player.team} size="sm" showCode={true} />
                  </div>
                </div>

                <div className="text-right relative z-10">
                  <div className={cn(
                    "text-2xl font-black mb-0.5",
                    index === 0 ? themeStyles[theme].split(' ')[1] : "text-slate-900 dark:text-white"
                  )}>
                    {player.stat}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-white/30">{player.subtitle}</div>
                </div>
              </div>
            ));
          })()
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-white/30 text-sm">
            No statistics available yet
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, data, dataKey, color, glowColor }: { title: string, subtitle: string, data: TopPlayerItem[], dataKey: string, color: string, glowColor: string }) {
  return (
    <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#060212]/50 p-4 sm:p-6 shadow-2xl overflow-hidden relative">
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none", glowColor)} />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-0.5">{title}</h2>
          <p className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-wider">{subtitle}</p>
        </div>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff40" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#ffffff60' }}
              dy={10}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
              tick={{ fill: '#ffffff60' }}
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{ backgroundColor: '#060212', border: '1px solid #ffffff10', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: color, fontWeight: 'bold', fontSize: '12px' }}
              labelStyle={{ color: '#ffffff80', marginBottom: '4px', fontSize: '10px' }}
            />
            <Bar dataKey="stat" name={dataKey} radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} opacity={1 - (index * 0.15)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['playerStats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
    refetchInterval: 60000, // Real-time refresh every minute
  });

  const getFlagUrl = (teamName: string) => {
    const map: Record<string, string> = {
      'USA': 'us', 'Mexico': 'mx', 'Canada': 'ca', 'Argentina': 'ar', 'France': 'fr',
      'Brazil': 'br', 'England': 'gb-eng', 'Spain': 'es', 'Germany': 'de', 'Portugal': 'pt',
      'Netherlands': 'nl', 'Italy': 'it', 'Croatia': 'hr', 'Uruguay': 'uy', 'Colombia': 'co',
      'Senegal': 'sn', 'Japan': 'jp', 'South Korea': 'kr', 'Morocco': 'ma', 'Switzerland': 'ch',
      'Belgium': 'be', 'Ecuador': 'ec', 'Poland': 'pl', 'Australia': 'au', 'Ghana': 'gh',
      'Serbia': 'rs', 'Denmark': 'dk', 'Tunisia': 'tn', 'Cameroon': 'cm', 'Saudi Arabia': 'sa',
      'Iran': 'ir', 'Wales': 'gb-wls', 'Costa Rica': 'cr', 'Qatar': 'qa', 'Ivory Coast': 'ci',
      'Nigeria': 'ng', 'Algeria': 'dz', 'Egypt': 'eg', 'Mali': 'ml', 'Sweden': 'se',
      'Norway': 'no', 'Turkey': 'tr', 'Ukraine': 'ua', 'Scotland': 'gb-sct', 'Peru': 'pe',
      'Chile': 'cl', 'Paraguay': 'py', 'Venezuela': 've', 'Panama': 'pa', 'Jamaica': 'jm',
      'Bosnia & Herzegovina': 'ba', 'Austria': 'at', 'Czech Republic': 'cz', 'Slovakia': 'sk',
      'Romania': 'ro', 'Hungary': 'hu', 'Greece': 'gr', 'Republic of Ireland': 'ie', 'Ireland': 'ie',
      'Northern Ireland': 'gb-nir', 'Finland': 'fi', 'Iceland': 'is', 'Honduras': 'hn',
      'El Salvador': 'sv', 'New Zealand': 'nz', 'South Africa': 'za', 'Bolivia': 'bo',
      'Haiti': 'ht', 'Trinidad and Tobago': 'tt', 'Macedonia': 'mk', 'North Macedonia': 'mk',
      'Slovenia': 'si', 'Albania': 'al', 'Georgia': 'ge', 'Bulgaria': 'bg'
    };
    
    const code = map[teamName];
    if (code) return `https://flagcdn.com/w80/${code}.png`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${teamName}&backgroundColor=060212&textColor=d946ef`;
  };

  const mapData = (sourceArray: any[], statKey: string, limit = 5): TopPlayerItem[] => {
    if (!sourceArray) return [];
    return sourceArray.slice(0, limit).map((item: any) => ({
      id: String(item.player.id),
      name: item.player.shortName || item.player.name,
      team: {
        id: String(item.team.id),
        name: item.team.name,
        code: item.team.name.substring(0, 3).toUpperCase(),
        flag: getFlagUrl(item.team.name),
      },
      stat: item.statistics[statKey],
      subtitle: `${item.statistics.appearances || 0} Matches`,
      imageUrl: `/api/image?type=player&id=${item.player.id}`,
    }));
  };

  const topScorers = mapData(data?.topPlayers?.goals, 'goals');
  const topAssists = mapData(data?.topPlayers?.assists, 'assists');
  const cleanSheets = mapData(data?.topPlayers?.cleanSheet, 'cleanSheet');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Player Statistics</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          Real-time tournament leaders in goals, assists, and clean sheets
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <LoadingSkeleton type="card" className="h-[300px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <LoadingSkeleton type="table" count={5} />
            <LoadingSkeleton type="table" count={5} />
            <LoadingSkeleton type="table" count={5} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 3 Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartCard title="Top Goalscorers" subtitle="Golden Boot Race" data={topScorers} dataKey="Goals" color="#f59e0b" glowColor="bg-amber-500/5" />
            <ChartCard title="Most Assists" subtitle="Playmaker Award" data={topAssists} dataKey="Assists" color="#10b981" glowColor="bg-emerald-500/5" />
            <ChartCard title="Clean Sheets" subtitle="Golden Glove Race" data={cleanSheets} dataKey="Clean Sheets" color="#06b6d4" glowColor="bg-cyan-500/5" />
          </div>

          {/* Leaderboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <PlayerLeaderboard 
            title="Top Scorers" 
            icon={SoccerBallIcon} 
            data={topScorers} 
            theme="amber" 
            statLabel="Goals"
          />
          <PlayerLeaderboard 
            title="Most Assists" 
            icon={ShoeAssistIcon} 
            data={topAssists} 
            theme="emerald" 
            statLabel="Assists"
          />
          <PlayerLeaderboard 
            title="Clean Sheets" 
            icon={GoalNetIcon} 
            data={cleanSheets} 
            theme="cyan" 
            statLabel="Clean Sheets"
          />
          </div>
        </div>
      )}
    </div>
  );
}
