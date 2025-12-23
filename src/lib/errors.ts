import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Specific error types
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Invalid request', details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests', public retryAfterSeconds?: number) {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(500, message, 'INTERNAL_ERROR', details);
    this.name = 'InternalServerError';
  }
}

/**
 * Centralized error handler
 * Returns appropriate NextResponse based on error type
 */
export function handleApiError(error: unknown): NextResponse {
  // Handle known ApiError instances
  if (error instanceof ApiError) {
    const response: {
      success: false;
      error: string;
      code?: string;
      details?: unknown;
    } = {
      success: false,
      error: error.message,
    };

    if (error.code) {
      response.code = error.code;
    }

    // Include details only in development or for validation errors
    if (isDev || error instanceof ValidationError) {
      if (error.details) {
        response.details = error.details;
      }
    }

    // Special handling for rate limit errors
    if (error instanceof RateLimitError) {
      const headers: HeadersInit = {};
      if (error.retryAfterSeconds) {
        headers['Retry-After'] = String(error.retryAfterSeconds);
      }
      return NextResponse.json(response, { status: error.statusCode, headers });
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle unexpected errors
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log full error details in development, generic message in production
  if (isDev) {
    console.error('[API Error]', {
      message: errorMessage,
      stack: errorStack,
      error,
    });
  } else {
    console.error('[API Error]', errorMessage);
  }

  return NextResponse.json(
    {
      success: false,
      error: isDev ? errorMessage : 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDev && errorStack && { stack: errorStack }),
    },
    { status: 500 }
  );
}

/**
 * Wrapper for async route handlers to automatically catch errors
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

