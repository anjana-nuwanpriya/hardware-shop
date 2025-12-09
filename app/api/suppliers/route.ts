import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { CreateSupplierSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Suppliers retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check if code already exists
    const isUniqueCode = await checkUnique('suppliers', 'code', code)
    if (!isUniqueCode) {
      return badRequestResponse('Supplier code already exists')
    }

    // Check if email already exists (if provided)
    if (email) {
      const isUniqueEmail = await checkUnique('suppliers', 'email', email)
      if (!isUniqueEmail) {
        return badRequestResponse('Email already exists')
      }
    }

    // Create supplier
    const { data, error } = await supabase
      .from('suppliers')
      .insert([
        {
          id: generateId(),
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

    return createdResponse(data, 'Supplier created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}