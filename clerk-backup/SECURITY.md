# Security Documentation

This document outlines the security measures implemented in the Bedtime Stories application to
protect user data and prevent unauthorized access to sensitive information.

## API Key Security

### Server-Side Only API Keys

- All OpenAI API interactions have been moved to server-side endpoints to prevent API key exposure.
- The `OPENAI_API_KEY` environment variable is used exclusively on the server-side.
- The client-side `NEXT_PUBLIC_OPENAI_API_KEY` has been removed to prevent potential leakage.

### API Endpoints

- `/api/openai`: Secure server-side endpoint for all OpenAI interactions
- `/api/generateStory`: Updated to use server-side API key
- `/api/testApiKey`: Updated to use server-side API key

## Security Middleware

### Security Headers

The application implements security headers through the `securityHeaders` middleware:

- `X-Content-Type-Options: nosniff`: Prevents MIME type sniffing
- `X-Frame-Options: DENY`: Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block`: Provides XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`: Controls referrer information
- `Content-Security-Policy`: Restricts resource loading to trusted sources
- Cache control headers for API routes to prevent caching of sensitive data

### Security Monitoring

The application implements security monitoring through the `securityMonitoring` middleware:

- Detection of suspicious query parameters (SQL injection, XSS attempts)
- Detection of suspicious path access attempts
- Detection of API keys in URLs
- Logging of security events
- Blocking of suspicious requests in production

## Authentication

- Clerk authentication is used to secure user accounts
- Protected routes require authentication
- API routes return 401 for unauthenticated requests

## Environment Variables

- Server-side environment variables are properly segregated from client-side variables
- Environment validation ensures required variables are present
- Example environment files provide clear documentation of required variables

## Data Protection

- User preferences and story history are stored securely
- Sensitive operations are performed server-side
- Error handling prevents leakage of sensitive information

## Development Practices

- Security-focused code reviews
- Regular dependency updates
- Secure coding practices

## Reporting Security Issues

If you discover a security vulnerability, please send an email to
[security@example.com](mailto:security@example.com). All security vulnerabilities will be promptly
addressed.

## Future Enhancements

- Rate limiting to prevent abuse
- Additional logging and monitoring
- Regular security audits
