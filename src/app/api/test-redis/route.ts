import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Create Redis client with retries
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000),
  },
});

export async function GET() {
  try {
    // Check if Redis environment variables are set
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('Redis environment variables are not set');
    }

    console.log('Testing Redis connection...');
    console.log('Redis URL:', process.env.UPSTASH_REDIS_REST_URL);
    console.log(
      'Redis Token (first 10 chars):',
      process.env.UPSTASH_REDIS_REST_TOKEN.substring(0, 10) + '...'
    );

    // Simple test
    const testKey = 'test:connection';
    const testValue = { timestamp: new Date().toISOString() };

    // Set test value
    await redis.set(testKey, testValue);
    console.log('Set test value:', testValue);

    // Get test value
    const result = await redis.get(testKey);
    console.log('Get test value:', result);

    // Clean up
    await redis.del(testKey);

    return NextResponse.json({
      status: 'success',
      message: 'Redis connection test successful',
      result,
    });
  } catch (error: any) {
    console.error('Redis test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Redis connection test failed',
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          url: process.env.UPSTASH_REDIS_REST_URL,
          envVarsSet: {
            url: !!process.env.UPSTASH_REDIS_REST_URL,
            token: !!process.env.UPSTASH_REDIS_REST_TOKEN,
            nodeEnv: process.env.NODE_ENV,
          },
        },
      },
      { status: 500 }
    );
  }
}
