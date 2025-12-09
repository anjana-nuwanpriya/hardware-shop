import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { CreateCategorySchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Categories retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod
    const validationResult = CreateCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const { name, description } = validationResult.data

    // Check if category name already exists
    const isUnique = await checkUnique('categories', 'name', name)
    if (!isUnique) {
      return badRequestResponse('Category name already exists')
    }

    // Create category
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          description: description || null,
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

    return createdResponse(data, 'Category created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}