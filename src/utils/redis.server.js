'use strict';

const { Redis } = require('@upstash/redis');

let redis;

// Only initialize Redis if environment variables are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // Mock Redis client for development/build
  redis = {
    get: async () => null,
    set: async () => 'OK',
    hget: async () => null,
    hset: async () => 1,
    hgetall: async () => ({}),
  };

  if (process.env.NODE_ENV === 'production') {
    console.warn('Redis environment variables are not configured. Using mock Redis client.');
  }
}

module.exports = redis;
