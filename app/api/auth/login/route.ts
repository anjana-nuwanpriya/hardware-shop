import { NextRequest } from 'next/server'
import {
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/api-responses'
import { LoginSchema, formatZodErrors } from '@/lib/validation'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod
   // Validate with Zod
    const validationResult = LoginSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const { email, password } = validationResult.data

    // Attempt login
    const result = await loginUser(email, password)

    if (result.error) {
      return badRequestResponse(result.error)
    }

    // Login successful
    return successResponse(
      {
        user: result.user,
        message: 'Login successful',
      },
      'Login successful'
    )
  } catch (error) {
    console.error('Login error:', error)
    return serverErrorResponse(error as Error)
  }
}