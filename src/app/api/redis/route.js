'use strict';

import { NextResponse } from 'next/server';
import redis from '../../../utils/redis.server';

export async function POST(request) {
  try {
    const { operation, key, value, field, options } = await request.json();

    switch (operation) {
      case 'get':
        const getValue = await redis.get(key);
        return NextResponse.json({ success: true, data: getValue });

      case 'set':
        const setValue = await redis.set(key, value, options);
        return NextResponse.json({ success: true, data: setValue });

      case 'hget':
        const hgetValue = await redis.hget(key, field);
        return NextResponse.json({ success: true, data: hgetValue });

      case 'hset':
        const hsetValue = await redis.hset(key, field, value);
        return NextResponse.json({ success: true, data: hsetValue });

      case 'hgetall':
        const hgetallValue = await redis.hgetall(key);
        return NextResponse.json({ success: true, data: hgetallValue });

      default:
        return NextResponse.json({ success: false, error: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Redis operation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
