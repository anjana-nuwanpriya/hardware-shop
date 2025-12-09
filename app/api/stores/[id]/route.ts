import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { CreateStoreSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Store')
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

    const validationResult = CreateStoreSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const { code, name, address, phone, email } = validationResult.data

    const { data, error } = await supabase
      .from('stores')
      .update({
        code,
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Store')
    }

    return successResponse(data, 'Store updated successfully')
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
      .from('stores')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Store')
    }

    return successResponse(null, 'Store deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}