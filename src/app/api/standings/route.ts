// GET /api/standings
import { NextResponse } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchStandings } from '@/lib/worldcup26-api';
import type { Standing } from '@/types/football';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const standings = await getOrSetCache<Record<string, Standing[]>>(
      'worldcup:standings',
      CACHE_TTL.STANDINGS,
      async () => {
        const standingsData = await fetchStandings();
        if (!standingsData || Object.keys(standingsData).length === 0) {
          return {};
        }

        return standingsData;
      }
    );

    return NextResponse.json({ data: standings });
  } catch (error) {
    console.error('[API /standings] Error:', error);
    return NextResponse.json({ data: {} });
  }
}
