// GET /api/matches/[id]
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrSetCache, CACHE_TTL } from '@/lib/cache';
import { fetchMatchDetail } from '@/lib/worldcup26-api';
import type { MatchDetail } from '@/types/football';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
    }

    const matchDetail = await getOrSetCache<MatchDetail | null>(
      `worldcup:match:${id}`,
      CACHE_TTL.MATCH_DETAIL,
      async () => {
        const detailData = await fetchMatchDetail(id);
        if (!detailData) {
          return null;
        }

        return detailData;
      }
    );

    if (!matchDetail) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ data: matchDetail });
  } catch (error) {
    console.error('[API /matches/[id]] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
