// GET /api/teams
import { NextResponse } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchTeamsData } from '@/lib/worldcup26-api';
import type { Team } from '@/types/football';

export async function GET() {
  try {
    const teams = await getOrSetCache<Team[]>(
      'worldcup:teams',
      CACHE_TTL.TEAMS,
      async () => {
        const apiData = await fetchTeamsData();
        if (!apiData || !apiData.length) {
          return [];
        }

        // Teams are already properly formatted from worldcup26-api
        return apiData.map((t: any) => ({
          id: String(t.id),
          name: t.name_en || t.name,
          code: t.fifa_code || t.name_en?.substring(0, 3).toUpperCase() || 'TBD',
          flag: t.flag || '',
          group: t.group || '',
        }));
      }
    );

    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error('[API /teams] Error:', error);
    return NextResponse.json({ data: [] });
  }
}
