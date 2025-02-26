import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { logger } from '@/utils/logger';

/**
 * Security monitoring middleware to detect and log potential security issues
 */
export function securityMonitoring(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.toString();
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

  // Check for suspicious query parameters
  const suspiciousParams = ['script', 'eval', 'exec', 'select', 'union', 'insert', 'drop', 'alert'];
  const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const hasSuspiciousParams = Object.values(queryParams).some((value) =>
    suspiciousParams.some((param) => value.toLowerCase().includes(param))
  );

  // Check for suspicious paths
  const suspiciousPaths = ['/admin', '/wp-login', '/wp-admin', '/.env', '/config', '/backup'];
  const hasSuspiciousPath = suspiciousPaths.some((path) => request.nextUrl.pathname.includes(path));

  // Check for API key pattern in URL
  const apiKeyPattern = /sk-[a-zA-Z0-9]{20,}/;
  const hasApiKeyInUrl = apiKeyPattern.test(url);

  // Log security events
  if (hasSuspiciousParams || hasSuspiciousPath || hasApiKeyInUrl) {
    logger.warn('Security alert detected', {
      url: request.nextUrl.pathname,
      method,
      userAgent,
      clientIp,
      hasSuspiciousParams,
      hasSuspiciousPath,
      hasApiKeyInUrl,
      environment: env.NODE_ENV,
    });

    // In production, you might want to block these requests
    if (env.NODE_ENV === 'production' && (hasSuspiciousPath || hasApiKeyInUrl)) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden', message: 'Access denied' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return response;
}

export default securityMonitoring;
