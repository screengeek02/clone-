import { NextRequest, NextResponse } from 'next/server';
import { runGlobalSearch } from '@/lib/services/search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const data = await runGlobalSearch(q);
  return NextResponse.json(data);
}
