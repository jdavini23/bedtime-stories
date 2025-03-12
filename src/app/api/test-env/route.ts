import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    openai: {
      keyExists: !!process.env.OPENAI_API_KEY,
    },
    supabase: {
      urlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    upstash: {
      urlExists: !!process.env.UPSTASH_REDIS_REST_URL,
      tokenExists: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  });
}
