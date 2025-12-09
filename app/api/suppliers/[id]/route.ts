import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { CreateSupplierSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Supplier')
    }

    return successResponse(data, 'Supplier retrieved successfully')
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
    const validationResult = CreateSupplierSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const {
      code,
      name,
      contact_person,
      phone,
      email,
      address,
      city,
      payment_terms,
      opening_balance,
      opening_balance_type,
    } = validationResult.data

    // Update supplier
    const { data, error } = await supabase
      .from('suppliers')
      .update({
        code,
        name,
        contact_person: contact_person || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        payment_terms: payment_terms || null,
        opening_balance: opening_balance || 0,
        opening_balance_type: opening_balance_type || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Supplier')
    }

    return successResponse(data, 'Supplier updated successfully')
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

    // Soft delete
    const { data, error } = await supabase
      .from('suppliers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Supplier')
    }

    return successResponse(null, 'Supplier deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}