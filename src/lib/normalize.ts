// ============================================
// World Cup 2026 - Data Normalizer
// Transforms API-Football raw responses into
// our clean internal types
// ============================================

import type { Team, Match, MatchStatus, Standing, MatchEvent, MatchDetail } from '@/types/football';

/**
 * Normalize API-Football status codes to our MatchStatus
 */
function normalizeStatus(shortStatus: string): MatchStatus {
  const statusMap: Record<string, MatchStatus> = {
    'TBD': 'scheduled',
    'NS': 'scheduled',
    'CANC': 'postponed',
    'PST': 'postponed',
    'SUSP': 'postponed',
    'INT': 'live',
    '1H': 'live',
    'HT': 'live',
    '2H': 'live',
    'ET': 'live',
    'BT': 'live',
    'P': 'live',
    'LIVE': 'live',
    'FT': 'finished',
    'AET': 'finished',
    'PEN': 'finished',
    'AWD': 'finished',
    'WO': 'finished',
  };
  return statusMap[shortStatus] || 'scheduled';
}

/**
 * Normalize API-Football team to our Team type
 */
export function normalizeTeam(apiTeam: {
  id: number;
  name: string;
  code?: string;
  logo?: string;
  country?: string;
}, group?: string): Team {
  return {
    id: String(apiTeam.id),
    name: apiTeam.name,
    code: apiTeam.code || apiTeam.name.substring(0, 3).toUpperCase(),
    flag: apiTeam.logo || '',
    group: group || '',
  };
}

/**
 * Normalize API-Football fixture to our Match type
 */
export function normalizeMatch(apiFixture: {
  fixture: {
    id: number;
    date: string;
    venue: { name: string; city: string };
    status: { short: string; long: string };
  };
  league: { round: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}): Match {
  const round = apiFixture.league.round;
  // Extract group from round string like "Group A - 1"
  const groupMatch = round.match(/Group\s+([A-L])/i);
  const group = groupMatch ? `Group ${groupMatch[1]}` : undefined;

  return {
    id: String(apiFixture.fixture.id),
    homeTeam: normalizeTeam(apiFixture.teams.home, group?.replace('Group ', '')),
    awayTeam: normalizeTeam(apiFixture.teams.away, group?.replace('Group ', '')),
    homeScore: apiFixture.goals.home,
    awayScore: apiFixture.goals.away,
    date: apiFixture.fixture.date,
    venue: apiFixture.fixture.venue.name,
    city: apiFixture.fixture.venue.city,
    group,
    round,
    status: normalizeStatus(apiFixture.fixture.status.short),
  };
}

/**
 * Normalize API-Football standings
 */
export function normalizeStandings(apiStandings: {
  league: {
    standings: Array<Array<{
      rank: number;
      team: { id: number; name: string; logo: string };
      points: number;
      goalsDiff: number;
      group: string;
      all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: { for: number; against: number };
      };
    }>>;
  };
}): Record<string, Standing[]> {
  const result: Record<string, Standing[]> = {};

  for (const groupStandings of apiStandings.league.standings) {
    if (!groupStandings.length) continue;
    const groupName = groupStandings[0].group;

    result[groupName] = groupStandings.map(entry => ({
      team: normalizeTeam(entry.team, groupName.replace('Group ', '')),
      played: entry.all.played,
      won: entry.all.win,
      drawn: entry.all.draw,
      lost: entry.all.lose,
      goalsFor: entry.all.goals.for,
      goalsAgainst: entry.all.goals.against,
      goalDifference: entry.goalsDiff,
      points: entry.points,
    }));
  }

  return result;
}

/**
 * Normalize API-Football event type
 */
function normalizeEventType(type: string, detail: string): MatchEvent['type'] {
  const lower = type.toLowerCase();
  if (lower === 'goal') return 'goal';
  if (lower === 'card' && detail.toLowerCase().includes('yellow')) return 'yellow_card';
  if (lower === 'card' && detail.toLowerCase().includes('red')) return 'red_card';
  if (lower === 'subst') return 'substitution';
  if (lower === 'var') return 'var';
  return 'goal';
}

/**
 * Normalize match detail with events and statistics
 */
export function normalizeMatchDetail(apiData: {
  fixture: {
    id: number;
    date: string;
    venue: { name: string; city: string };
    status: { short: string; long: string };
  };
  league: { round: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
  events?: Array<{
    time: { elapsed: number; extra: number | null };
    team: { id: number; name: string };
    player: { name: string };
    assist: { name: string | null };
    type: string;
    detail: string;
  }>;
  statistics?: Array<{
    team: { id: number };
    statistics: Array<{ type: string; value: string | number | null }>;
  }>;
}): MatchDetail {
  const match = normalizeMatch(apiData);

  const events: MatchEvent[] = (apiData.events || []).map((evt, i) => ({
    id: `evt-${apiData.fixture.id}-${i}`,
    type: normalizeEventType(evt.type, evt.detail),
    time: evt.time.elapsed,
    extraTime: evt.time.extra || undefined,
    team: evt.team.id === apiData.teams.home.id ? 'home' as const : 'away' as const,
    player: evt.player.name,
    assist: evt.assist.name || undefined,
    detail: evt.detail,
  }));

  return {
    ...match,
    events,
  };
}
