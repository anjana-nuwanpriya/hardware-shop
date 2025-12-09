/**
 * API Response Helpers
 * Standardized response format for all API endpoints
 */

/**
 * Standard response structure
 */
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  details?: any
  message?: string
  timestamp: string
}

/**
 * Success Response (200 OK)
 */
export function successResponse<T>(
  data: T,
  message?: string
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message: message || 'Operation successful',
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Created Response (201 Created)
 */
export function createdResponse<T>(
  data: T,
  message?: string
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message: message || 'Resource created successfully',
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Bad Request Response (400)
 */
export function badRequestResponse(
  message: string,
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Unauthorized Response (401)
 */
export function unauthorizedResponse(message?: string): Response {
  const response: ApiResponse = {
    success: false,
    error: message || 'Unauthorized',
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Forbidden Response (403)
 */
export function forbiddenResponse(message?: string): Response {
  const response: ApiResponse = {
    success: false,
    error: message || 'Forbidden',
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Not Found Response (404)
 */
export function notFoundResponse(resource: string): Response {
  const response: ApiResponse = {
    success: false,
    error: `${resource} not found`,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Validation Error Response (422)
 */
export function validationErrorResponse(
  errors: Record<string, string[]>
): Response {
  const response: ApiResponse = {
    success: false,
    errors,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 422,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Conflict Response (409)
 */
export function conflictResponse(message: string): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 409,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Server Error Response (500)
 */
export function serverErrorResponse(error: Error | any): Response {
  // Log error for debugging
  console.error('Server Error:', {
    message: error?.message || String(error),
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  })

  const response: ApiResponse = {
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  }

  // Only include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.details = {
      message: error?.message || String(error),
    }
  }

  return new Response(JSON.stringify(response), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Unprocessable Entity Response (422) - Alternative to validationErrorResponse
 */
export function unprocessableEntityResponse(message: string): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 422,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Too Many Requests Response (429)
 */
export function tooManyRequestsResponse(
  message: string = 'Too many requests'
): Response {
  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status: 429,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Custom response with specific status
 */
export function customResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): Response {
  const isSuccess = status >= 200 && status < 300

  const response: ApiResponse<T> = {
    success: isSuccess,
    data: isSuccess ? data : undefined,
    error: !isSuccess ? (data as any) : undefined,
    message: message || (isSuccess ? 'Success' : 'Error'),
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}