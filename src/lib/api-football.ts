// ============================================
// World Cup 2026 - API-Football Service
// Server-side only - never import on client
// ============================================

import type { ApiFootballResponse } from '@/types/football';

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';
const LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID || '1';
const SEASON = process.env.API_FOOTBALL_SEASON || '2026';

const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Check if API-Football is configured with a valid key
 */
export function isApiConfigured(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_api_football_key' && API_KEY.length > 5);
}

/**
 * Generic API-Football fetch function
 * Returns null on error instead of throwing
 */
export async function apiFootballFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<ApiFootballResponse<T> | null> {
  if (!isApiConfigured()) {
    console.log('[API-Football] No API key configured, using mock data');
    return null;
  }

  const url = new URL(endpoint, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-key': API_KEY!,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[API-Football] HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json() as ApiFootballResponse<T>;

    // Check for API errors
    if (data.errors && ((Array.isArray(data.errors) && data.errors.length > 0) || Object.keys(data.errors).length > 0)) {
      console.error('[API-Football] API errors:', data.errors);
      return null;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[API-Football] Request timed out');
      } else {
        console.error('[API-Football] Fetch error:', error.message);
      }
    }
    return null;
  }
}

/**
 * Fetch teams for the World Cup
 */
export async function fetchTeams() {
  return apiFootballFetch<{
    team: { id: number; name: string; code: string; country: string; logo: string };
  }>('/teams', { league: LEAGUE_ID, season: SEASON });
}

/**
 * Fetch fixtures/matches
 */
export async function fetchFixtures(params?: { date?: string; status?: string }) {
  const queryParams: Record<string, string | number> = {
    league: LEAGUE_ID,
    season: SEASON,
  };
  if (params?.date) queryParams.date = params.date;
  if (params?.status) queryParams.status = params.status;

  return apiFootballFetch<{
    fixture: {
      id: number;
      date: string;
      venue: { name: string; city: string };
      status: { short: string; long: string; elapsed: number | null };
    };
    league: { round: string };
    teams: {
      home: { id: number; name: string; logo: string };
      away: { id: number; name: string; logo: string };
    };
    goals: { home: number | null; away: number | null };
  }>('/fixtures', queryParams);
}

/**
 * Fetch standings
 */
export async function fetchStandings() {
  return apiFootballFetch<{
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
  }>('/standings', { league: LEAGUE_ID, season: SEASON });
}

/**
 * Fetch match details by fixture ID
 */
export async function fetchMatchDetail(fixtureId: string) {
  return apiFootballFetch<{
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
    events: Array<{
      time: { elapsed: number; extra: number | null };
      team: { id: number; name: string };
      player: { name: string };
      assist: { name: string | null };
      type: string;
      detail: string;
    }>;
    statistics: Array<{
      team: { id: number };
      statistics: Array<{ type: string; value: string | number | null }>;
    }>;
  }>('/fixtures', { id: fixtureId });
}

/**
 * Get API status for health check
 */
export function getApiStatus(): string {
  return isApiConfigured() ? 'configured' : 'not_configured (using mock data)';
}
