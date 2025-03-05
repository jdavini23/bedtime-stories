import { kv } from '@vercel/kv';

export async function getCache(key: string) {
  const value = await kv.get(key);
  return value;
}

export async function setCache(key: string, value: any) {
  await kv.set(key, value);
}

export async function deleteCache(key: string) {
  await kv.del(key);
}