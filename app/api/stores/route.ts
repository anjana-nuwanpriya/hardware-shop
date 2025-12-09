import { NextRequest } from 'next/server'
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-responses'
import { CreateStoreSchema, formatZodErrors } from '@/lib/validation'
import { supabase } from '@/lib/supabase'
import { checkUnique } from '@/lib/db'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      return badRequestResponse(error.message)
    }

    return successResponse(data || [], 'Stores retrieved successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = CreateStoreSchema.safeParse(body)

    if (!validationResult.success) {
      return validationErrorResponse(
        formatZodErrors(validationResult.error)
      )
    }

    const { code, name, address, phone, email } = validationResult.data

    // Check uniqueness
    const isUniqueCode = await checkUnique('stores', 'code', code)
    if (!isUniqueCode) {
      return badRequestResponse('Store code already exists')
    }

    if (email) {
      const isUniqueEmail = await checkUnique('stores', 'email', email)
      if (!isUniqueEmail) {
        return badRequestResponse('Email already exists')
      }
    }

    // Create store
    const { data, error } = await supabase
      .from('stores')
      .insert([
        {
          id: generateId(),
          code,
          name,
          address: address || null,
          phone: phone || null,
          email: email || null,
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

    return createdResponse(data, 'Store created successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}