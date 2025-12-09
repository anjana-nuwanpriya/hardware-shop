import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { CreateCategorySchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Category')
    }

    return successResponse(data, 'Category retrieved successfully')
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

    // Validate with Zod
    const validationResult = CreateCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const { name, description } = validationResult.data

    // Update category
    const { data, error } = await supabase
      .from('categories')
      .update({
        name,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Category')
    }

    return successResponse(data, 'Category updated successfully')
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

    // Soft delete - set is_active to false
    const { data, error } = await supabase
      .from('categories')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Category')
    }

    return successResponse(null, 'Category deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}