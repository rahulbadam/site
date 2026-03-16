import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES, HTTP_STATUS } from '@vivahbandhan/shared';

export interface AppError extends FastifyError {
  code: string;
  details?: Record<string, unknown>;
}

export class ValidationError extends Error implements AppError {
  code = ERROR_CODES.VALIDATION_ERROR;
  details?: Record<string, unknown>;
  statusCode = HTTP_STATUS.BAD_REQUEST;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class UnauthorizedError extends Error implements AppError {
  code = ERROR_CODES.UNAUTHORIZED;
  statusCode = HTTP_STATUS.UNAUTHORIZED;

  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements AppError {
  code = ERROR_CODES.FORBIDDEN;
  statusCode = HTTP_STATUS.FORBIDDEN;

  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error implements AppError {
  code = ERROR_CODES.NOT_FOUND;
  statusCode = HTTP_STATUS.NOT_FOUND;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements AppError {
  code = ERROR_CODES.CONFLICT;
  statusCode = HTTP_STATUS.CONFLICT;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error implements AppError {
  code = ERROR_CODES.RATE_LIMIT_EXCEEDED;
  statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends Error implements AppError {
  code = ERROR_CODES.QUOTA_EXCEEDED;
  statusCode = HTTP_STATUS.FORBIDDEN;

  constructor(message: string = 'Daily quota exceeded. Upgrade to premium for unlimited access.') {
    super(message);
    this.name = 'QuotaExceededError';
  }
}

export class PremiumFeatureError extends Error implements AppError {
  code = ERROR_CODES.PREMIUM_FEATURE;
  statusCode = HTTP_STATUS.FORBIDDEN;

  constructor(message: string = 'This feature requires a premium subscription') {
    super(message);
    this.name = 'PremiumFeatureError';
  }
}

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const statusCode = error.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (error.validation) {
    await reply.status(HTTP_STATUS.BAD_REQUEST).send({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details: error.validation,
      },
    });
    return;
  }

  const appError = error as AppError;

  if (appError.code && Object.values(ERROR_CODES).includes(appError.code as (typeof ERROR_CODES)[keyof typeof ERROR_CODES])) {
    await reply.status(statusCode).send({
      success: false,
      error: {
        code: appError.code,
        message: error.message,
        details: appError.details,
      },
    });
    return;
  }

  request.log.error({ error, statusCode }, 'Unhandled error');

  await reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    },
  });
}