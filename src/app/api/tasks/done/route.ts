import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api_cds.hcmict.io/api';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const timestamp = Date.now();
    const response = await fetch(
      `${API_BASE_URL}/work/Task/DoneTask`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en,vi-VN;q=0.9,vi;q=0.8',
          'authorization': token,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Done task API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
