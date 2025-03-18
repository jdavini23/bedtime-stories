import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectPath = requestUrl.searchParams.get('redirect_url') || '/dashboard';
  
  // Sanitize redirect path to prevent open redirect vulnerabilities
  const sanitizedRedirectPath = redirectPath.startsWith('/') 
    ? redirectPath.replace(/[^\w\-\/\?=&%]/g, '')
    : '/dashboard';

  console.log('[Auth Callback] Processing callback with code:', code ? 'present' : 'missing');
  console.log('[Auth Callback] Redirect path:', sanitizedRedirectPath);
  
  // Log all search params for debugging (excluding the code value itself)
  const searchParamsLog = Array.from(requestUrl.searchParams.entries())
    .filter(([key]) => key !== 'code')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  console.log('[Auth Callback] Search params:', searchParamsLog || 'none');
  
  if (!code) {
    console.log('[Auth Callback] No code provided, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login?error=Missing%20authentication%20code', request.url));
  }
  
  try {
    console.log('[Auth Callback] Creating Supabase client');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    console.log('[Auth Callback] Exchanging code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('[Auth Callback] Error exchanging code for session:', error.message);
      console.error('[Auth Callback] Error details:', JSON.stringify({
        code: error.status || 'unknown',
        name: error.name,
        message: error.message
      }));
      
      // Redirect to login with error message
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }
    
    // Verify we got a session
    if (!data.session || !data.user) {
      console.error('[Auth Callback] No session or user returned despite successful exchange');
      return NextResponse.redirect(
        new URL('/auth/login?error=No%20session%20established', request.url)
      );
    }
    
    // Log successful authentication (without exposing sensitive data)
    console.log('[Auth Callback] Successfully exchanged code for session');
    console.log('[Auth Callback] User authenticated:', data.user.id);
    console.log('[Auth Callback] Session established, expires:', new Date(data.session.expires_at! * 1000).toISOString());
    console.log('[Auth Callback] Redirecting to:', sanitizedRedirectPath);
    
    // Successful auth, redirect to dashboard or specified path
    return NextResponse.redirect(new URL(sanitizedRedirectPath, request.url));
  } catch (err) {
    // Detailed error logging
    console.error('[Auth Callback] Unexpected error during authentication:');
    console.error('[Auth Callback] Error type:', err instanceof Error ? err.constructor.name : typeof err);
    console.error('[Auth Callback] Error message:', err instanceof Error ? err.message : 'Unknown error');
    
    if (err instanceof Error && err.stack) {
      console.error('[Auth Callback] Stack trace:', err.stack.split('\n').slice(0, 3).join('\n'));
    }
    
    // Redirect to login with generic error
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication%20failed&reason=server_error', request.url)
    );
  }
}
