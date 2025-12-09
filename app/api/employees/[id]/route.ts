import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const CreateEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Employee')
    }

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const validationResult = CreateEmployeeSchema.safeParse(body)

    if (!validationResult.success) {
      const errors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (!errors[path]) errors[path] = []
        errors[path].push(issue.message)
      })
      return validationErrorResponse(errors)
    }

    const { name, email, phone, role } = validationResult.data

    const { data, error } = await supabase
      .from('employees')
      .update({
        name,
        email,
        phone: phone || null,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Employee')
    }

    return successResponse(data, 'Employee updated successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('employees')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Employee')
    }

    return successResponse(null, 'Employee deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}