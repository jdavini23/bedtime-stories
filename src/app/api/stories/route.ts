import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const auth = getAuth(request);
  const { userId } = auth;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
