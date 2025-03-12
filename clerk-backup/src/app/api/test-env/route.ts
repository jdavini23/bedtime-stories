import { NextResponse } from 'next/server';

export async function GET() {
  // Only return masked/partial information for security
  const openaiKey = process.env.OPENAI_API_KEY || 'not-set';
  const maskedKey =
    openaiKey !== 'not-set'
      ? `${openaiKey.substring(0, 7)}...${openaiKey.substring(openaiKey.length - 3)}`
      : 'not-set';

  return NextResponse.json({
    openai: {
      keyExists: !!process.env.OPENAI_API_KEY,
      keyFormat: maskedKey,
    },
    clerk: {
      publishableKeyExists: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKeyExists: !!process.env.CLERK_SECRET_KEY,
    },
    nodeEnv: process.env.NODE_ENV || 'not-set',
  });
}
