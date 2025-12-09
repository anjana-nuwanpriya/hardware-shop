import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'
import { generateId } from '@/lib/utils'
import { z } from 'zod'

const CreateEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Employees retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check uniqueness
    const isUniqueEmail = await checkUnique('employees', 'email', email)
    if (!isUniqueEmail) {
      return badRequestResponse('Email already exists')
    }

    // Create employee
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          id: generateId(),
          name,
          email,
          phone: phone || null,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      return badRequestResponse(error.message)
    }

    return createdResponse(data, 'Employee created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}