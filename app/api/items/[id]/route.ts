import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { CreateItemSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Item')
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

    const validationResult = CreateItemSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const {
      code,
      name,
      description,
      category_id,
      unit,
      reorder_level,
      allow_negative_stock,
    } = validationResult.data

    const { data, error } = await supabase
      .from('items')
      .update({
        code,
        name,
        description: description || null,
        category_id,
        unit,
        reorder_level: reorder_level || 0,
        allow_negative_stock: allow_negative_stock || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Item')
    }

    return successResponse(data, 'Item updated successfully')
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
      .from('items')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Item')
    }

    return successResponse(null, 'Item deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}