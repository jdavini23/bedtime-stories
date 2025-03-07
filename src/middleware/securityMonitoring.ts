import { NextRequest, NextResponse } from 'next/server';

interface SecurityLog {
  timestamp: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  details: Record<string, unknown>;
}

interface RequestData {
  count: number;
  timestamp: number;
}

interface SecurityConfig {
  rateLimitWindow: number;
  maxRequestsPerWindow: number;
  suspiciousPatterns: RegExp[];
  requiredHeaders: string[];
}

const securityLogs: SecurityLog[] = [];

function logSecurityEvent(
  type: SecurityLog['type'],
  message: string,
  details: Record<string, unknown>
): void {
  const log: SecurityLog = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
  };

  securityLogs.push(log);
  console.log(`[Security ${type}]`, message, details);
}

// Security configuration
const securityConfig: SecurityConfig = {
  rateLimitWindow: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 100,
  suspiciousPatterns: [
    /\.\.[/\\]/, // Directory traversal - fixed unnecessary escape character
    /[;|&`']/, // Command injection
    /<script>/i, // XSS attempt
  ],
  requiredHeaders: ['x-clerk-auth-token'],
};

// Rate limiting storage
const requestCounts = new Map<string, RequestData>();

// Security monitoring middleware to detect and log potential security issues
export async function securityMonitoring(request: NextRequest): Promise<NextResponse> {
  const ip: string = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent: string = request.headers.get('user-agent') || 'unknown';
  const path: string = request.nextUrl.pathname;

  // Rate limiting check
  const now = Date.now();
  const requestData = requestCounts.get(ip);

  if (requestData && now - requestData.timestamp < securityConfig.rateLimitWindow) {
    requestData.count++;
    if (requestData.count > securityConfig.maxRequestsPerWindow) {
      logSecurityEvent('warning', 'Rate limit exceeded', { ip, path });
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }

  // Check for suspicious patterns
  const urlString = request.url;
  const hasSuspiciousPattern = securityConfig.suspiciousPatterns.some((pattern) =>
    pattern.test(urlString)
  );

  if (hasSuspiciousPattern) {
    logSecurityEvent('warning', 'Suspicious request pattern detected', {
      ip,
      path,
      userAgent,
      pattern: 'Potential security threat',
    });
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Check for required security headers
  const missingHeaders = securityConfig.requiredHeaders.filter(
    (header) => !request.headers.get(header)
  );

  if (missingHeaders.length > 0 && !path.startsWith('/api/public')) {
    logSecurityEvent('warning', 'Missing required security headers', {
      ip,
      path,
      missingHeaders,
    });
  }

  // Log successful requests for monitoring
  logSecurityEvent('info', 'Request processed', {
    ip,
    path,
    userAgent,
    method: request.method,
  });

  return NextResponse.next();
}

// Export security logs for monitoring
export function getSecurityLogs(): SecurityLog[] {
  return [...securityLogs];
}

// Clear old request counts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.timestamp >= securityConfig.rateLimitWindow) {
      requestCounts.delete(ip);
    }
  }
}, securityConfig.rateLimitWindow);
