import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';
import { apiErrorSchema } from './validations';

// API validation middleware
export function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

// Create API error response
export function createApiError(
  message: string,
  statusCode: number = 400,
  details?: any,
): NextResponse {
  const errorResponse = {
    success: false,
    error: message,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Create API success response
export function createApiSuccess<T>(
  message: string,
  data?: T,
  statusCode: number = 200,
): NextResponse {
  const successResponse = {
    success: true,
    message,
    ...(data && { data }),
  };

  return NextResponse.json(successResponse, { status: statusCode });
}

// Validate request body
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<
  { success: true; data: T } | { success: false; response: NextResponse }
> {
  try {
    const body = await request.json();
    const validation = validateRequest(schema, body);

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      return {
        success: false,
        response: createApiError(`Validation failed: ${errorMessage}`, 400, {
          validationErrors: validation.error.issues,
        }),
      };
    }

    return { success: true, data: validation.data };
  } catch (error) {
    return {
      success: false,
      response: createApiError('Invalid JSON in request body', 400),
    };
  }
}

// Validate query parameters
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): { success: true; data: T } | { success: false; response: NextResponse } {
  const { searchParams } = new URL(request.url);
  const queryObject = Object.fromEntries(searchParams.entries());

  const validation = validateRequest(schema, queryObject);

  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');

    return {
      success: false,
      response: createApiError(
        `Query validation failed: ${errorMessage}`,
        400,
        {
          validationErrors: validation.error.issues,
        },
      ),
    };
  }

  return { success: true, data: validation.data };
}

// Handle API errors with proper logging
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`API Error in ${context}:`, error);

  if (error instanceof z.ZodError) {
    return createApiError('Validation failed', 400, {
      validationErrors: error.issues,
    });
  }

  if (error instanceof Error) {
    return createApiError(error.message, 500);
  }

  return createApiError('An unexpected error occurred', 500);
}
