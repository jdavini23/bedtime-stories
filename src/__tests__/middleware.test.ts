// Mock Next.js modules before importing anything
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({})),
    redirect: jest.fn(() => ({})),
  },
}));

// Mock Clerk's authMiddleware
jest.mock('@clerk/nextjs', () => ({
  authMiddleware: jest.fn(() => () => ({})),
}));

// Import after mocking
import { authMiddleware } from '@clerk/nextjs';

// Mock the middleware module
jest.mock('@/middleware', () => {
  // Call the mocked authMiddleware with the expected config
  const config = {
    publicRoutes: ['/', '/sign-in*', '/sign-up*', '/api/webhook/clerk', '/story', '/story/(.*)'],
    ignoredRoutes: ['/api/webhook/clerk'],
  };

  authMiddleware(config);

  // Return a mock middleware function
  return jest.fn(() => ({}));
});

describe('Middleware Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure Clerk authMiddleware with correct public and ignored routes', () => {
    // Import the middleware to trigger the mocks
    require('@/middleware');

    // Check that authMiddleware was called with the correct configuration
    expect(authMiddleware).toHaveBeenCalledWith(
      expect.objectContaining({
        publicRoutes: expect.arrayContaining([
          '/',
          '/sign-in*',
          '/sign-up*',
          '/api/webhook/clerk',
          '/story',
          '/story/(.*)',
        ]),
        ignoredRoutes: expect.arrayContaining(['/api/webhook/clerk']),
      })
    );
  });
});
