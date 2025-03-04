import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface SecurityLog {
  timestamp: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  details: Record<string, unknown>;
}

const securityLogs: SecurityLog[] = [];

function logSecurityEvent(
  type: SecurityLog['type'],
  message: string,
  details: Record<string, unknown>
) {
  const log: SecurityLog = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
  };
  
  securityLogs.push(log);
  console.log(`[Security ${type}]`, message, details);
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Security monitoring middleware to detect and log potential security issues
export async function securityMonitoring(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const path = request.nextUrl.pathname;

  // Rate limiting check
  const now = Date.now();
  const requestData = requestCounts.get(ip);

  if (requestData && now - requestData.timestamp < RATE_LIMIT_WINDOW) {
    requestData.count++;
    if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
      logSecurityEvent('warning', 'Rate limit exceeded', { ip, path });
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\.[\/\\]/,  // Directory traversal
    /[;|&`']/,     // Command injection
    /<script>/i,   // XSS attempt
  ];

  const urlString = request.url;
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(urlString));

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
  const requiredHeaders = ['x-clerk-auth-token'];
  const missingHeaders = requiredHeaders.filter(header => !request.headers.get(header));

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
export function getSecurityLogs() {
  return securityLogs;
}

// Clear old request counts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.timestamp >= RATE_LIMIT_WINDOW) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);
