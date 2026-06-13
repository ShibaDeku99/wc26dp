// GET /api/groups
import { NextResponse } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchGroups } from '@/lib/worldcup26-api';
import type { Group } from '@/types/football';

export async function GET() {
  try {
    const groups = await getOrSetCache<Group[]>(
      'worldcup:groups',
      CACHE_TTL.GROUPS,
      async () => {
        const groupsData = await fetchGroups();
        if (!groupsData || !groupsData.length) {
          return [];
        }
        return groupsData;
      }
    );

    return NextResponse.json({ data: groups });
  } catch (error) {
    console.error('[API /groups] Error:', error);
    return NextResponse.json({ data: [] });
  }
}
