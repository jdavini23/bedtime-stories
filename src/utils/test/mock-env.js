export const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key',
  OPENAI_API_KEY: 'sk-mock-openai-key',
  UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'mock-upstash-token',
  NODE_ENV: 'test',
};

export function setupMockEnv() {
  Object.entries(mockEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

export function clearMockEnv() {
  Object.keys(mockEnv).forEach((key) => {
    delete process.env[key];
  });
}
