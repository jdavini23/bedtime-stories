import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/loggerInstance';

const CLERK_API_BASE = 'https://api.clerk.com/v1';
const TEMPLATE_NAME = 'supabase-auth';

// Template configuration based on memory requirements
const DEFAULT_TEMPLATE = {
  name: TEMPLATE_NAME,
  template: {
    claims: {
      aud: 'authenticated',
      role: 'authenticated',
      email: '{{user.primary_email_address}}',
      user_id: '{{user.id}}',
      user_metadata: {},
    },
  },
};

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return addCorsHeaders(response);
}

export async function GET(req: NextRequest) {
  try {
    logger.info('JWT template API route called', {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      const error = 'Missing CLERK_SECRET_KEY';
      logger.error(error);
      const response = NextResponse.json({ success: false, error }, { status: 500 });
      return addCorsHeaders(response);
    }

    logger.info('Fetching JWT templates from Clerk', {
      templateName: TEMPLATE_NAME,
      desiredClaims: DEFAULT_TEMPLATE.template.claims,
    });

    // List all JWT templates
    try {
      const listResponse = await fetch(`${CLERK_API_BASE}/jwt_templates`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(5000),
      });

      const listData = await listResponse.text();
      let templates;

      try {
        templates = JSON.parse(listData);
      } catch (e) {
        logger.error('Failed to parse JWT templates response', {
          status: listResponse.status,
          statusText: listResponse.statusText,
          responseText: listData,
        });
        const response = NextResponse.json(
          { success: false, error: 'Invalid response from Clerk API' },
          { status: 502 }
        );
        return addCorsHeaders(response);
      }

      if (!listResponse.ok) {
        logger.error('Failed to list JWT templates', {
          status: listResponse.status,
          statusText: listResponse.statusText,
          error: listData,
        });
        const response = NextResponse.json(
          { success: false, error: `Failed to list JWT templates: ${listResponse.statusText}` },
          { status: listResponse.status }
        );
        return addCorsHeaders(response);
      }

      logger.info('Retrieved JWT templates', {
        count: templates.data?.length || 0,
        templateNames: templates.data?.map((t: any) => t.name) || [],
      });

      // Check if our template exists
      const existingTemplate = templates.data?.find((t: any) => t.name === TEMPLATE_NAME);

      if (existingTemplate) {
        // Check if template needs updating
        const currentClaims = existingTemplate.template?.claims || {};
        const desiredClaims = DEFAULT_TEMPLATE.template.claims;

        const needsUpdate = Object.entries(desiredClaims).some(
          ([key, value]) => JSON.stringify(currentClaims[key]) !== JSON.stringify(value)
        );

        if (needsUpdate) {
          logger.info('Updating existing JWT template', {
            name: TEMPLATE_NAME,
            currentClaims,
            desiredClaims,
          });

          const updateResponse = await fetch(
            `${CLERK_API_BASE}/jwt_templates/${existingTemplate.id}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                template: DEFAULT_TEMPLATE.template,
              }),
            }
          );

          const updateData = await updateResponse.text();
          let updatedTemplate;

          try {
            updatedTemplate = JSON.parse(updateData);
          } catch (e) {
            logger.error('Failed to parse template update response', {
              status: updateResponse.status,
              statusText: updateResponse.statusText,
              responseText: updateData,
            });
            const response = NextResponse.json(
              { success: false, error: 'Invalid response from Clerk API during update' },
              { status: 502 }
            );
            return addCorsHeaders(response);
          }

          if (!updateResponse.ok) {
            logger.error('Failed to update JWT template', {
              status: updateResponse.status,
              statusText: updateResponse.statusText,
              error: updateData,
              template: DEFAULT_TEMPLATE,
            });
            const response = NextResponse.json(
              {
                success: false,
                error: `Failed to update JWT template: ${updateResponse.statusText}`,
              },
              { status: updateResponse.status }
            );
            return addCorsHeaders(response);
          }

          return NextResponse.json({
            success: true,
            template: updatedTemplate,
            message: 'Template updated successfully',
          });
        }

        logger.info('Found existing JWT template with correct configuration', {
          name: existingTemplate.name,
          claims: existingTemplate.template?.claims,
        });

        return NextResponse.json({
          success: true,
          template: existingTemplate,
          message: 'Template exists and is up to date',
        });
      }

      logger.info('Creating new JWT template', { template: DEFAULT_TEMPLATE });

      // Create the template if it doesn't exist
      const createResponse = await fetch(`${CLERK_API_BASE}/jwt_templates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(DEFAULT_TEMPLATE),
      });

      const createData = await createResponse.text();
      let newTemplate;

      try {
        newTemplate = JSON.parse(createData);
      } catch (e) {
        logger.error('Failed to parse template creation response', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          responseText: createData,
        });
        const response = NextResponse.json(
          { success: false, error: 'Invalid response from Clerk API during creation' },
          { status: 502 }
        );
        return addCorsHeaders(response);
      }

      if (!createResponse.ok) {
        logger.error('Failed to create JWT template', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          error: createData,
          template: DEFAULT_TEMPLATE,
        });
        const response = NextResponse.json(
          { success: false, error: `Failed to create JWT template: ${createResponse.statusText}` },
          { status: createResponse.status }
        );
        return addCorsHeaders(response);
      }

      logger.info('Successfully created JWT template', {
        name: newTemplate.name,
        claims: newTemplate.template?.claims,
      });

      return NextResponse.json({
        success: true,
        template: newTemplate,
        message: 'Template created successfully',
      });
    } catch (fetchError) {
      logger.error('Error fetching from Clerk API', {
        error:
          fetchError instanceof Error
            ? {
                message: fetchError.message,
                name: fetchError.name,
                stack: fetchError.stack,
              }
            : fetchError,
      });

      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
      const response = NextResponse.json(
        { success: false, error: `Error communicating with Clerk API: ${errorMessage}` },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
  } catch (error) {
    logger.error('Error managing JWT template', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              type: error.constructor.name,
            }
          : error,
    });

    const response = NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        hint: 'Check server logs for more details',
      },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
