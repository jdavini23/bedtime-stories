import { logger } from '../src/utils/loggerInstance';
import { validateEnv } from './validate-env';
import { Redis } from '@upstash/redis';
import { kv } from '@vercel/kv';

async function verifyProduction() {
  logger.info('Starting production verification...');

  // 1. Verify Environment Variables
  try {
    validateEnv();
    logger.info('✅ Environment variables verified');
  } catch (error) {
    logger.error('❌ Environment variable verification failed:', error);
    process.exit(1);
  }

  // 2. Verify Redis Connection
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const testKey = 'production-test';
    await redis.set(testKey, 'test');
    const testValue = await redis.get(testKey);
    await redis.del(testKey);

    if (testValue === 'test') {
      logger.info('✅ Redis connection verified');
    } else {
      throw new Error('Redis test failed');
    }
  } catch (error) {
    logger.error('❌ Redis verification failed:', error);
    process.exit(1);
  }

  // 3. Verify Supabase Connection
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL!, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });

    if (response.ok) {
      logger.info('✅ Supabase connection verified');
    } else {
      throw new Error('Supabase connection failed');
    }
  } catch (error) {
    logger.error('❌ Supabase verification failed:', error);
    process.exit(1);
  }

  // 4. Verify API Keys
  try {
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
    if (!process.env.GEMINI_API_KEY?.startsWith('AI')) {
      throw new Error('Invalid Gemini API key format');
    }
    logger.info('✅ API keys verified');
  } catch (error) {
    logger.error('❌ API key verification failed:', error);
    process.exit(1);
  }

  // 5. Verify Build Output
  try {
    const fs = require('fs');
    const path = require('path');

    const buildDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      throw new Error('Build directory not found');
    }

    const requiredFiles = ['server', 'static', 'BUILD_ID'];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(buildDir, file))) {
        throw new Error(`Required build file ${file} not found`);
      }
    }
    logger.info('✅ Build output verified');
  } catch (error) {
    logger.error('❌ Build verification failed:', error);
    process.exit(1);
  }

  logger.info('✅ Production verification complete');
}

// Run verification if script is called directly
if (require.main === module) {
  verifyProduction().catch((error) => {
    logger.error('Production verification failed:', error);
    process.exit(1);
  });
}

export { verifyProduction };
