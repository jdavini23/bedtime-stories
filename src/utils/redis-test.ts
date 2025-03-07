import { Redis } from '@upstash/redis';
import { logger } from './loggerInstance';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function testRedisConnection() {
  try {
    // Test 1: Basic Set/Get
    const testKey = 'test:connection';
    const testValue = { timestamp: new Date().toISOString(), status: 'ok' };

    logger.info('Testing Redis connection - Setting test value...');
    await redis.set(testKey, testValue);

    logger.info('Getting test value...');
    const retrievedValue = await redis.get(testKey);

    // Test 2: Hash operations
    const hashKey = 'test:hash';
    logger.info('Testing Redis hash operations...');
    await redis.hset(hashKey, {
      field1: 'value1',
      field2: 'value2',
    });

    const hashValue = await redis.hgetall(hashKey);

    // Test 3: Key expiration
    const tempKey = 'test:temp';
    logger.info('Testing key expiration...');
    await redis.set(tempKey, 'temporary', { ex: 5 }); // expires in 5 seconds

    // Clean up
    logger.info('Cleaning up test keys...');
    await redis.del(testKey);
    await redis.del(hashKey);

    logger.info('Redis connection test results:', {
      basicOperation: {
        success: true,
        value: retrievedValue,
      },
      hashOperation: {
        success: true,
        value: hashValue,
      },
      expirationOperation: {
        success: true,
      },
    });

    return true;
  } catch (error) {
    logger.error('Redis connection test failed:', error);
    throw error;
  }
}
