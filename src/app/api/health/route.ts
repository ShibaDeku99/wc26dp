// GET /api/health
import { NextResponse } from 'next/server';
import { getApiStatus } from '@/lib/api-football';
import { getCacheStatus } from '@/lib/cache';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    apiFootball: getApiStatus(),
    cache: getCacheStatus(),
    timestamp: new Date().toISOString(),
  });
}
