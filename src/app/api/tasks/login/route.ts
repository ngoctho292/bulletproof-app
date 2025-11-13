import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api_cds.hcmict.io/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = Date.now();

    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en,vi-VN;q=0.9,vi;q=0.8',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
