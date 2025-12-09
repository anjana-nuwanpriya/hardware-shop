import { NextRequest } from 'next/server'
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-responses'
import { CreateCustomerSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return notFoundResponse('Customer')
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

    const validationResult = CreateCustomerSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const {
      code,
      name,
      phone,
      email,
      address,
      city,
      credit_limit,
      customer_type,
      opening_balance,
      opening_balance_type,
    } = validationResult.data

    const { data, error } = await supabase
      .from('customers')
      .update({
        code,
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        credit_limit: credit_limit || 0,
        customer_type: customer_type || 'retail',
        opening_balance: opening_balance || 0,
        opening_balance_type: opening_balance_type || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Customer')
    }

    return successResponse(data, 'Customer updated successfully')
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
      .from('customers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return notFoundResponse('Customer')
    }

    return successResponse(null, 'Customer deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}