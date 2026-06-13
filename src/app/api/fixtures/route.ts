// GET /api/fixtures?date=...&group=...&team=...&status=...
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchFixtures } from '@/lib/worldcup26-api';
import type { Match } from '@/types/football';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get('date');
    const group = searchParams.get('group');
    const team = searchParams.get('team');
    const status = searchParams.get('status');

    // Create cache key based on params
    const cacheKey = `worldcup:fixtures:${date || 'all'}:${group || 'all'}:${status || 'all'}`;

    let fixtures = await getOrSetCache<Match[]>(
      cacheKey,
      CACHE_TTL.FIXTURES,
      async () => {
        const matches = await fetchFixtures();
        if (!matches || !matches.length) {
          return [];
        }
        return matches;
      }
    );

    // Apply client-side filters
    if (group) {
      fixtures = fixtures.filter(f => f.group === group || f.group === `Group ${group}`);
    }
    if (team) {
      const teamLower = team.toLowerCase();
      fixtures = fixtures.filter(f =>
        f.homeTeam.name.toLowerCase().includes(teamLower) ||
        f.awayTeam.name.toLowerCase().includes(teamLower) ||
        f.homeTeam.code.toLowerCase() === teamLower ||
        f.awayTeam.code.toLowerCase() === teamLower
      );
    }
    if (status) {
      fixtures = fixtures.filter(f => f.status === status);
    }
    if (date) {
      fixtures = fixtures.filter(f => f.date.startsWith(date));
    }

    // Sort by date
    fixtures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ data: fixtures });
  } catch (error) {
    console.error('[API /fixtures] Error:', error);
    return NextResponse.json({ data: [] });
  }
}
