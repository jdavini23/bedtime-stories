/**
 * Mock environment configuration for testing
 */
export const env = {
  NODE_ENV: 'development',
  OPENAI_API_KEY: 'mock-api-key',
  KV_REST_API_URL: 'mock-kv-url',
  KV_REST_API_TOKEN: 'mock-kv-token',
  SENTRY_DSN: 'mock-sentry-dsn',
  ENABLE_MOCK_STORIES: true,
  ENABLE_CACHING: false,
  STORY_CACHE_TTL_SECONDS: 86400,
};
