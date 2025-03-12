import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/gemini/route';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
              role: 'user',
            },
          },
        },
        error: null,
      }),
    },
  })),
}));

describe('Gemini API Route', () => {
  it('handles unauthorized requests', async () => {
    const request = new NextRequest('http://localhost/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = (await POST(request)) as NextResponse;
    expect(response.status).toBe(401);
  });

  it('handles authorized requests', async () => {
    const request = new NextRequest('http://localhost/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
    });

    const response = (await POST(request)) as NextResponse;
    expect(response.status).toBe(200);
  });
});
