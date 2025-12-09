// TODO: Replace this with full error classes from Claude
export class ValidationError extends Error {
  statusCode = 422;
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class BusinessRuleError extends Error {
  statusCode = 422;
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

export function handleError(error: any): Response {
  const message = error?.message || 'An error occurred';
  const statusCode = error?.statusCode || 500;
  
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    { status: statusCode }
  );
}
