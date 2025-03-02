import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const auth = getAuth();
  const { userId } = auth;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
