import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { CreateCustomerSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Customers retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check uniqueness
    const isUniqueCode = await checkUnique('customers', 'code', code)
    if (!isUniqueCode) {
      return badRequestResponse('Customer code already exists')
    }

    if (email) {
      const isUniqueEmail = await checkUnique('customers', 'email', email)
      if (!isUniqueEmail) {
        return badRequestResponse('Email already exists')
      }
    }

    // Create customer
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          id: generateId(),
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

    return createdResponse(data, 'Customer created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}