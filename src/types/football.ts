// ============================================
// World Cup 2026 Dashboard - Type Definitions
// ============================================

export type Team = {
  id: string;
  name: string;
  code: string;
  flag: string;
  group?: string;
};

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  venue: string;
  city?: string;
  group?: string;
  round: string;
  status: MatchStatus;
  liveMinute?: number; // Added to show live clock (e.g. 65')
  attendance?: string;
  weather?: string;
};

export type Standing = {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type Group = {
  name: string;
  teams: Team[];
};

export type MatchEvent = {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var';
  time: number;
  extraTime?: number;
  team: 'home' | 'away';
  player: string;
  assist?: string;
  detail?: string;
};

export type MatchStatistic = {
  category?: string;
  label: string;
  home: string | number;
  away: string | number;
  homeValue?: number;
  awayValue?: number;
};

export type MatchStatsPeriod = {
  period: 'Full Time' | '1st Half' | '2nd Half';
  statistics: MatchStatistic[];
};

export type MatchDetail = Match & {
  events: MatchEvent[];
  statistics: MatchStatsPeriod[];
  graphPoints?: { minute: number; value: number }[];
  lineups?: any;
  attendance?: string;
  referee?: string;
  weather?: string;
};

export type TodayData = {
  live: Match[];
  upcoming: Match[];
  finished: Match[];
};

export type DashboardStats = {
  totalTeams: number;
  totalGroups: number;
  totalMatches: number;
  matchesPlayed: number;
};

export type HealthStatus = {
  status: string;
  apiFootball: string;
  cache: string;
  timestamp: string;
};

// API-Football raw response types
export type ApiFootballResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T[];
};
