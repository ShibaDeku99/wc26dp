import { NextResponse } from 'next/server';

const RAPID_API_KEY = '6091cc7786mshb10d529b299ebeep114844jsne1d9933403f8';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return new NextResponse('Missing type or id', { status: 400 });
  }

  try {
    let fetchUrl = '';
    let headers: any = {};

    if (type === 'player') {
      fetchUrl = `https://sofascore.p.rapidapi.com/players/get-image?playerId=${id}`;
      headers = {
        'x-rapidapi-host': 'sofascore.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      };
    } else if (type === 'team') {
      fetchUrl = `https://api.sofascore.app/api/v1/team/${id}/image`;
      headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      };
    } else {
      return new NextResponse('Invalid type', { status: 400 });
    }

    const response = await fetch(fetchUrl, { headers });

    if (!response.ok) {
      return new NextResponse('Image not found', { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
