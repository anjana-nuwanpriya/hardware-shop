import { NextRequest } from 'next/server'
import { successResponse, serverErrorResponse } from '@/lib/api-responses'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Try to connect to Supabase
    let databaseStatus = 'disconnected'
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('count(*)', { count: 'exact', head: true })

      if (!error) {
        databaseStatus = 'connected'
      }
    } catch {
      databaseStatus = 'disconnected'
    }

    const response = {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      environment: process.env.NODE_ENV || 'development',
    }

    return successResponse(response, 'Server is healthy')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}