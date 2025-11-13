import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api_cds.hcmict.io/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = request.headers.get('authorization');
    const userId = searchParams.get('userId');
    const searchText = searchParams.get('searchText') || '';
    const startDate = searchParams.get('startDate') || '01/01/2025';
    const endDate = searchParams.get('endDate') || '31/12/2025';

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const url = `${API_BASE_URL}/work/TaskReport/GetReportTaskByUserCurrentFunc?searchText=${searchText}&arrUserIds=%5B${userId}%5D&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en,vi-VN;q=0.9,vi;q=0.8',
        'authorization': token,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Task list API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
