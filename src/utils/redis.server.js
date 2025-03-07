'use strict';

const { Redis } = require('@upstash/redis');

let redis;

function convertRedisUrl(url) {
  if (!url) return url;
  // Convert rediss:// URL to https:// format if needed
  if (url.startsWith('rediss://')) {
    // Extract host and credentials from rediss:// URL
    const match = url.match(/rediss:\/\/(.*):(.*)@(.*)/);
    if (match) {
      const [_, username, password, host] = match;
      return `https://${host}`;
    }
  }
  return url;
}

// Only initialize Redis if environment variables are available
if (process.env.Upstash_KV_URL && process.env.Upstash_KV_REST_API_TOKEN) {
  const url = convertRedisUrl(process.env.Upstash_KV_URL);
  redis = new Redis({
    url,
    token: process.env.Upstash_KV_REST_API_TOKEN,
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
