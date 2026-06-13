import { NextResponse } from 'next/server';

const RAPID_API_KEY = '6091cc7786mshb10d529b299ebeep114844jsne1d9933403f8';

export async function GET() {
  try {
    const url = 'https://sofascore.p.rapidapi.com/tournaments/get-top-players?tournamentId=16&seasonId=58210';
    
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'sofascore.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Sofascore: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Stats Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch player stats' }, { status: 500 });
  }
}
