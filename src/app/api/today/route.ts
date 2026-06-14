// GET /api/today
// (Triggering recompilation)
import { NextResponse } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchFixtures } from '@/lib/worldcup26-api';
import type { Match, TodayData } from '@/types/football';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const data = await getOrSetCache<TodayData>(
      `worldcup:today:${today}`,
      CACHE_TTL.TODAY,
      async () => {
        const matches = await fetchFixtures();
        if (!matches || !matches.length) {
          return { live: [], upcoming: [], finished: [] };
        }

        return {
          live: matches.filter(m => m.status === 'live'),
          upcoming: matches.filter(m => m.status === 'scheduled'),
          finished: matches.filter(m => m.status === 'finished'),
        };
      }
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API /today] Error:', error);
    return NextResponse.json({ data: { live: [], upcoming: [], finished: [] } });
  }
}
