import { getAuth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseUserService } from '@/services/supabaseUserService';
import { logger } from '@/utils/loggerInstance';
import { createAuthenticatedSupabaseClient } from '@/lib/supabase-auth';

/**
 * API route to test the integration between Clerk and Supabase
 * This is for development purposes only and should be disabled in production
 */
export async function GET(req: NextRequest) {
  try {
    logger.info('Starting integration test');

    // Get the current user from Clerk
    const session = getAuth(req);
    const userId = session.userId;

    logger.info('Checking authentication status', {
      hasSession: !!session,
      hasUserId: !!userId,
    });

    if (!userId) {
      const error = {
        error: 'Authentication required',
        details: 'No authenticated session found',
        debug: {
          hasSession: !!session,
          hasUserId: false,
        },
      };
      logger.error('Authentication check failed', error);
      return NextResponse.json(error, { status: 401 });
    }

    const user = await currentUser();
    logger.info('Retrieved current user', {
      hasUser: !!user,
      userId,
      emailCount: user?.emailAddresses?.length || 0,
    });

    if (!user) {
      const error = {
        error: 'Authentication required',
        details: 'No user found for session',
        debug: {
          hasSession: !!session,
          hasUserId: true,
          userId,
        },
      };
      logger.error('User retrieval failed', error);
      return NextResponse.json(error, { status: 401 });
    }

    // Get the primary email
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    logger.info('Checking primary email', {
      hasPrimaryEmail: !!primaryEmail,
      totalEmails: user.emailAddresses.length,
    });

    if (!primaryEmail) {
      const error = {
        error: 'User has no primary email',
        details: 'A primary email is required for Supabase integration',
        debug: {
          emailAddresses: user.emailAddresses.map((e) => ({
            id: e.id,
            isPrimary: e.id === user.primaryEmailAddressId,
          })),
        },
      };
      logger.error('Primary email check failed', error);
      return NextResponse.json(error, { status: 400 });
    }

    // Test JWT token generation
    logger.info('Testing JWT token generation', {
      templateName: 'supabase-auth',
      userId,
    });

    let jwtTest = { success: false, error: null };
    try {
      const token = await session.getToken({
        template: 'supabase-auth',
        skipCache: true, // Force fresh token generation
      });

      jwtTest = {
        success: !!token,
        error: token ? null : 'Failed to generate JWT token',
        details: token
          ? 'JWT token generated successfully'
          : 'Check your Clerk JWT template configuration',
        hint: !token
          ? 'Create a JWT template named "supabase-auth" in your Clerk dashboard'
          : undefined,
      };

      logger.info('JWT token generation result', {
        success: jwtTest.success,
        hasToken: !!token,
      });
    } catch (error) {
      jwtTest = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details: 'Error generating JWT token. Check your Clerk configuration.',
        hint: 'Create a JWT template named "supabase-auth" in your Clerk dashboard',
      };
      logger.error('JWT token generation failed', {
        error:
          error instanceof Error
            ? {
                message: error.message,
                type: error.constructor.name,
              }
            : error,
      });
    }

    // Verify the connection between Clerk and Supabase
    logger.info('Verifying Clerk-Supabase connection', { userId });
    const connectionStatus = await SupabaseUserService.verifyClerkSupabaseConnection(userId);
    logger.info('Connection verification result', connectionStatus);

    // If the user doesn't exist in Supabase, we'll note this but not try to create
    // since the tables might not exist yet
    let supabaseUser = null;
    let userCreationAttempt = null;

    if (connectionStatus.success && !connectionStatus.userExists && !connectionStatus.tableStatus) {
      logger.info('Attempting to create Supabase user', {
        userId,
        email: primaryEmail,
      });

      try {
        supabaseUser = await SupabaseUserService.createUser(userId, primaryEmail);
        userCreationAttempt = { success: !!supabaseUser };
        logger.info('Supabase user creation result', {
          success: userCreationAttempt.success,
          userId,
        });
      } catch (error) {
        userCreationAttempt = {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
        logger.error('Supabase user creation failed', {
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  type: error.constructor.name,
                }
              : error,
          userId,
        });
      }
    }

    // Test authenticated Supabase client
    logger.info('Testing authenticated Supabase client');
    let authenticatedClientTest = { success: false, error: null };
    try {
      const supabase = await createAuthenticatedSupabaseClient();

      // Try a simple query that doesn't depend on specific tables
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        authenticatedClientTest = {
          success: false,
          error: sessionError,
          details: 'Failed to authenticate with Supabase. Check your JWT configuration.',
          hint: 'Make sure your JWT template is configured correctly in Clerk',
        };
        logger.error('Supabase authentication failed', {
          error: sessionError,
          userId,
        });
      } else {
        authenticatedClientTest = {
          success: true,
          error: null,
          data: 'Successfully authenticated with Supabase',
          sessionData: {
            hasSession: !!sessionData.session,
            provider: sessionData.session?.provider,
          },
        };
        logger.info('Supabase authentication succeeded', {
          hasSession: !!sessionData.session,
          provider: sessionData.session?.provider,
        });
      }
    } catch (error) {
      authenticatedClientTest = {
        success: false,
        error:
          error instanceof Error
            ? {
                message: error.message,
                type: error.constructor.name,
              }
            : error,
        details: 'Failed to create authenticated Supabase client',
        hint: 'Check your JWT template configuration in Clerk',
      };
      logger.error('Supabase client creation failed', {
        error:
          error instanceof Error
            ? {
                message: error.message,
                type: error.constructor.name,
              }
            : error,
        userId,
      });
    }

    // Prepare response
    const response = {
      clerkUser: {
        id: userId,
        email: primaryEmail,
        metadata: {
          publicMetadata: user.publicMetadata,
          privateMetadata: user.privateMetadata,
        },
      },
      jwtTest,
      supabaseConnection: connectionStatus,
      supabaseUser: supabaseUser,
      userCreationAttempt,
      authenticatedClientTest,
      setupInstructions: {
        jwt: {
          templateName: 'supabase-auth',
          requiredClaims: {
            aud: 'authenticated',
            role: 'authenticated',
            email: '{{user.primary_email_address}}',
            user_id: '{{user.id}}',
            user_metadata: {},
          },
        },
        tables: connectionStatus.tableStatus
          ? {
              message:
                'Supabase tables need to be created. Please run the SQL script provided in the project.',
              scriptLocation: '/supabase/migrations/create_tables.sql',
            }
          : null,
      },
    };

    logger.info('Integration test completed', {
      success: true,
      jwtSuccess: jwtTest.success,
      connectionSuccess: connectionStatus.success,
      authSuccess: authenticatedClientTest.success,
    });

    return NextResponse.json(response);
  } catch (error) {
    const errorDetails = {
      error: 'Error testing integration',
      details:
        error instanceof Error
          ? {
              message: error.message,
              type: error.constructor.name,
              hint: 'Make sure you are signed in and have proper permissions',
            }
          : error,
    };

    logger.error('Integration test failed', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              type: error.constructor.name,
            }
          : error,
    });

    return NextResponse.json(errorDetails, { status: 500 });
  }
}
