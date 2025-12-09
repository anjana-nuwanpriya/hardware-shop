import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { CreateItemSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Items retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check uniqueness
    const isUniqueCode = await checkUnique('items', 'code', code)
    if (!isUniqueCode) {
      return badRequestResponse('Item code already exists')
    }

    // Create item
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          id: generateId(),
          code,
          name,
          description: description || null,
          category_id,
          unit,
          reorder_level: reorder_level || 0,
          allow_negative_stock: allow_negative_stock || false,
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

    return createdResponse(data, 'Item created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}