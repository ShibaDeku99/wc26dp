// src/lib/zafronix-api.ts
import type { MatchDetail } from '@/types/football';

const BASE_URL = 'https://api.zafronix.com/fifa/worldcup/v1';

function getHeaders() {
  const apiKey = process.env.ZAFRONIX_API_KEY;
  if (!apiKey || apiKey === 'your_zafronix_api_key_here') {
    throw new Error('ZAFRONIX_API_KEY is not configured in .env.local');
  }
  return {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

export async function fetchZafronix(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Zafronix API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[Zafronix API] Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function fetchZafronixStadiums() {
  // We'll map the exact structure once we have the API key to test
  return fetchZafronix('/stadiums');
}

export async function fetchZafronixMatchDetail(matchId: string) {
  // For match detail, we'll fetch from /matches/{id}
  return fetchZafronix(`/matches/${matchId}`);
}
