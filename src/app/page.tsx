'use client';

import { useState, useMemo, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users, Calendar, Trophy, BarChart3, Radio,
  ArrowRight, Globe, MapPin, Sparkles,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { MatchCard } from '@/components/dashboard/match-card';
import { NextMatchCountdown } from '@/components/dashboard/next-match-countdown';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { getGroupColor } from '@/lib/group-colors';
import { cn } from '@/lib/utils';
import type { TodayData, Match } from '@/types/football';

const QUICK_LINKS = [
  { href: '/groups', label: 'Groups', icon: Users, desc: '12 groups • 48 teams' },
  { href: '/fixtures', label: 'Fixtures', icon: Calendar, desc: 'Full schedule' },
  { href: '/standings', label: 'Standings', icon: BarChart3, desc: 'Group tables' },
  { href: '/live', label: 'Live Score', icon: Radio, desc: 'Real-time updates' },
];

export default function HomePage() {
  const { data: todayData, isLoading: todayLoading, refetch: refetchToday } = useQuery<{ data: TodayData }>({
    queryKey: ['today'],
    queryFn: () => fetch('/api/today').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const { data: fixturesData, isLoading: fixturesLoading } = useQuery<{ data: Match[] }>({
    queryKey: ['fixtures'],
    queryFn: () => fetch('/api/fixtures').then(r => r.json()),
    staleTime: 15 * 60 * 1000,
  });

  const allMatches = fixturesData?.data || [];
  const matchesPlayed = allMatches.filter(m => m.status === 'finished').length;

  const today = todayData?.data;

  // Extract 48 unique team flags from all matches
  const uniqueTeamFlags = useMemo(() => {
    if (!allMatches || allMatches.length === 0) return [];
    const flagsMap = new Map<string, string>();
    allMatches.forEach(m => {
      if (m.homeTeam?.id && m.homeTeam?.flag && !m.homeTeam.name.includes('TBD') && !m.homeTeam.name.includes('Winner')) {
        flagsMap.set(m.homeTeam.id, m.homeTeam.flag);
      }
      if (m.awayTeam?.id && m.awayTeam?.flag && !m.awayTeam.name.includes('TBD') && !m.awayTeam.name.includes('Winner')) {
        flagsMap.set(m.awayTeam.id, m.awayTeam.flag);
      }
    });
    return Array.from(flagsMap.values()).slice(0, 48); // Ensure max 48
  }, [allMatches]);

  // Find the absolute next upcoming match across all dates
  const nextAbsoluteMatch = useMemo(() => {
    if (!today?.upcoming || today.upcoming.length === 0) return null;
    return [...today.upcoming].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [today?.upcoming]);

  // Extract unique dates for upcoming matches based on user's local timezone
  const upcomingDates = useMemo(() => {
    if (!today?.upcoming) return [];
    const dates = new Set<string>();
    today.upcoming.forEach(m => {
      if (m.date) {
        // Convert to local date string (YYYY-MM-DD format)
        const d = new Date(m.date);
        const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dates.add(localDate);
      }
    });
    return Array.from(dates).sort();
  }, [today?.upcoming]);

  const [selectedDate, setSelectedDate] = useState<string>('');

  // Set initial selected date
  useEffect(() => {
    if (upcomingDates.length > 0 && !selectedDate) {
      setSelectedDate(upcomingDates[0]);
    }
  }, [upcomingDates, selectedDate]);

  const filteredUpcoming = useMemo(() => {
    if (!today?.upcoming || !selectedDate) return [];
    return today.upcoming.filter(m => {
      const d = new Date(m.date);
      const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return localDate === selectedDate;
    });
  }, [today?.upcoming, selectedDate]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-300 dark:border-white/[0.06] p-6 lg:p-10 min-h-[280px] lg:min-h-[340px] flex flex-col justify-center">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0">
          <img 
            src="https://media.licdn.com/dms/image/v2/D5612AQEujhupMumKFg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684522009244?e=2147483647&v=beta&t=YYJ7gpXcGtPVHmIcjgaLasg2lAP7Pd8NeAarrzZoCpE" 
            alt="World Cup 2026 Banner" 
            className="w-full h-full object-cover opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#0a0f1c] via-white/50 dark:via-[#0a0f1c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#0a0f1c]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-fuchsia-700 dark:text-fuchsia-400" />
            <span className="text-[11px] font-semibold text-fuchsia-700 dark:text-fuchsia-400 uppercase tracking-wider">
              FIFA World Cup 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            World Cup 2026
            <span className="gradient-text block lg:inline lg:ml-3">Dashboard</span>
          </h1>
          <p className="text-sm lg:text-base text-slate-600 dark:text-white/40 max-w-xl leading-relaxed">
            Track every match, score, and standing from the FIFA World Cup 2026.
            Live scores, fixtures, and comprehensive tournament analytics.
          </p>

          {/* Host countries */}
          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-white/30">
              <MapPin className="h-3 w-3" />
              <img src="https://flagcdn.com/w20/us.png" srcSet="https://flagcdn.com/w40/us.png 2x" alt="USA" className="w-3.5 h-auto shadow-sm rounded-[1px]" />
              <span>USA</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-white/30">
              <MapPin className="h-3 w-3" />
              <img src="https://flagcdn.com/w20/mx.png" srcSet="https://flagcdn.com/w40/mx.png 2x" alt="Mexico" className="w-3.5 h-auto shadow-sm rounded-[1px]" />
              <span>Mexico</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-white/30">
              <MapPin className="h-3 w-3" />
              <img src="https://flagcdn.com/w20/ca.png" srcSet="https://flagcdn.com/w40/ca.png 2x" alt="Canada" className="w-3.5 h-auto shadow-sm rounded-[1px]" />
              <span>Canada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardCard
          title="Teams"
          value={48}
          subtitle="48 national teams"
          icon={<Users className="h-5 w-5" />}
        >
          {uniqueTeamFlags.length > 0 && (
            <div className="flex flex-wrap gap-1 opacity-50 pt-1 justify-center">
              {uniqueTeamFlags.map((flag, idx) => (
                <div key={idx} className="w-[14px] h-[10px] rounded-[1px] overflow-hidden bg-slate-100 dark:bg-white/5 relative shadow-sm hover:scale-150 hover:z-10 transition-transform cursor-pointer" title={`Team ${idx + 1}`}>
                  <img src={flag} alt="flag" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
        <DashboardCard
          title="Groups"
          value={12}
          subtitle="Group A to L"
          icon={<Globe className="h-5 w-5" />}
        >
          <div className="flex flex-wrap gap-1 opacity-80 pt-2 justify-center">
            {['A','B','C','D','E','F','G','H','I','J','K','L'].map((g) => {
              return (
                <div key={g} className={cn("w-[18px] h-[14px] rounded-[2px] border flex items-center justify-center text-[9px] font-bold shadow-sm", "bg-emerald-500/10 dark:bg-emerald-500/20", "border-emerald-500/30", "text-emerald-700 dark:text-emerald-400")}>
                  {g}
                </div>
              );
            })}
          </div>
        </DashboardCard>
        <DashboardCard
          title="Total Matches"
          value={Math.max(104, allMatches.length)}
          subtitle="72 Group + 32 Knockout"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="flex items-center gap-1.5 opacity-60 pt-2">
            <div className="flex-[2.25]">
              <div className="text-[8px] mb-1 font-medium tracking-wider text-fuchsia-300">GROUP (72)</div>
              <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-fuchsia-500/70 w-full" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[8px] mb-1 font-medium tracking-wider text-purple-300">K.O (32)</div>
              <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500/70 w-full" />
              </div>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard
          title="Matches Played"
          value={matchesPlayed}
          subtitle={`${Math.round((matchesPlayed / Math.max(104, allMatches.length)) * 100)}% complete`}
          icon={<Trophy className="h-5 w-5" />}
        >
          <div className="pt-3 w-full opacity-80">
            <div className="flex justify-between text-[8px] text-slate-600 dark:text-white/40 mb-1 font-medium tracking-wider">
              <span>PROGRESS</span>
              <span>104</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full relative" 
                style={{ width: `${Math.round((matchesPlayed / Math.max(104, allMatches.length)) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-slate-300 dark:bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Today's Matches */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Matches */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(!todayLoading && today?.live && today.live.length > 0) ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Now</h2>
                </>
              ) : (
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Next Match</h2>
              )}
            </div>
            <Link
              href="/live"
              className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {todayLoading ? (
            <LoadingSkeleton type="match" count={2} />
          ) : today?.live && today.live.length > 0 ? (
            <div className="space-y-3">
              {today.live.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : nextAbsoluteMatch ? (
            <NextMatchCountdown 
              nextMatch={nextAbsoluteMatch} 
              onLive={() => refetchToday()} 
            />
          ) : (
            <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-slate-500 dark:text-white/30">No live matches at the moment</p>
            </div>
          )}

          {/* Upcoming */}
          <div className="flex items-center justify-between mt-6 mb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming</h2>
            <Link
              href="/fixtures"
              className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Full schedule <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {!todayLoading && upcomingDates.length > 0 && (
            <div className="flex overflow-x-auto gap-2 pb-3 mb-1 no-scrollbar">
              {upcomingDates.map(dateStr => {
                const dateObj = new Date(dateStr);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex flex-col items-center justify-center flex-shrink-0 px-4 py-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.06] text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:bg-white/[0.05]'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{dayName}</span>
                    <span className="text-xs font-semibold">{dayNum}</span>
                  </button>
                );
              })}
            </div>
          )}

          {todayLoading ? (
            <LoadingSkeleton type="match" count={3} />
          ) : filteredUpcoming.length > 0 ? (
            <div className="space-y-3">
              {filteredUpcoming.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-slate-500 dark:text-white/30">No upcoming matches scheduled today</p>
            </div>
          )}

          {/* Recent Results */}
          {today?.finished && today.finished.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Results</h2>
                <Link
                  href="/results"
                  className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  All results <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {today.finished.map(match => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Links Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h2>
          <div className="space-y-2">
            {QUICK_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-300 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.02] hover:bg-slate-100 dark:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{link.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-white/30">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 dark:text-white/20 group-hover:text-emerald-700 dark:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Tournament Info */}
          <div className="rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-gradient-to-br from-emerald-500/5 to-transparent p-5 mt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Tournament Info</h3>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-white/30">Format</span>
                <span className="text-slate-700 dark:text-white/70">48 teams, 12 groups</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-white/30">Dates</span>
                <span className="text-slate-700 dark:text-white/70">Jun 11 - Jul 19, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-white/30">Venues</span>
                <span className="text-slate-700 dark:text-white/70">16 stadiums</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-white/30">Hosts</span>
                <span className="flex items-center gap-1.5">
                  <img src="https://flagcdn.com/w20/us.png" srcSet="https://flagcdn.com/w40/us.png 2x" alt="USA" className="w-4 h-auto shadow-sm rounded-sm" />
                  <img src="https://flagcdn.com/w20/mx.png" srcSet="https://flagcdn.com/w40/mx.png 2x" alt="Mexico" className="w-4 h-auto shadow-sm rounded-sm" />
                  <img src="https://flagcdn.com/w20/ca.png" srcSet="https://flagcdn.com/w40/ca.png 2x" alt="Canada" className="w-4 h-auto shadow-sm rounded-sm" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-white/30">Final</span>
                <span className="text-slate-700 dark:text-white/70">MetLife Stadium, NJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
