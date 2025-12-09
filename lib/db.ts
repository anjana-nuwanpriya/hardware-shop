/**
 * Database Helper Functions
 * Reusable functions for Supabase CRUD operations
 */

import { supabase } from './supabase'
import { AnyEntity, AnyRecord } from './types'

/**
 * Fetch a single record by ID
 * Automatically filters by is_active = true
 */
export async function fetchOne<T>(
  table: string,
  id: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      return null
    }

    return data as T
  } catch (error) {
    console.error(`Exception fetching from ${table}:`, error)
    return null
  }
}

/**
 * Fetch multiple records with optional filters
 * Automatically filters by is_active = true
 */
export async function fetchMany<T>(
  table: string,
  filters?: Record<string, any>,
  orderBy?: { column: string; ascending?: boolean }
): Promise<T[]> {
  try {
    let query = supabase.from(table).select('*').eq('is_active', true)

    // Apply additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending !== false,
      })
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      return []
    }

    return (data as T[]) || []
  } catch (error) {
    console.error(`Exception fetching from ${table}:`, error)
    return []
  }
}

/**
 * Count active records in a table
 */
export async function countActive(table: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) {
      console.error(`Error counting ${table}:`, error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error(`Exception counting ${table}:`, error)
    return 0
  }
}

/**
 * Create a new record
 */
export async function createRecord<T extends AnyRecord>(
  table: string,
  data: T
): Promise<T> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error(`Error creating in ${table}:`, error)
      throw new Error(`Failed to create record: ${error.message}`)
    }

    return result as T
  } catch (error) {
    console.error(`Exception creating in ${table}:`, error)
    throw error
  }
}

/**
 * Update an existing record
 * Automatically sets updated_at timestamp
 */
export async function updateRecord<T extends AnyRecord>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<T> {
  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating ${table}:`, error)
      throw new Error(`Failed to update record: ${error.message}`)
    }

    return result as T
  } catch (error) {
    console.error(`Exception updating ${table}:`, error)
    throw error
  }
}

/**
 * Soft delete - set is_active to false
 */
export async function softDelete(table: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error(`Error deleting from ${table}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Exception deleting from ${table}:`, error)
    return false
  }
}

/**
 * Check if a value is unique in a field
 * Returns true if unique (doesn't exist), false if duplicate
 */
export async function checkUnique(
  table: string,
  field: string,
  value: any
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq(field, value)
      .eq('is_active', true)

    if (error) {
      console.error(`Error checking uniqueness in ${table}:`, error)
      return false
    }

    return !data || data.length === 0
  } catch (error) {
    console.error(`Exception checking uniqueness in ${table}:`, error)
    return false
  }
}

/**
 * Get a record with all details (no is_active filter)
 * Used for viewing deleted records in audit contexts
 */
export async function fetchOneUnfiltered<T>(
  table: string,
  id: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      return null
    }

    return data as T
  } catch (error) {
    console.error(`Exception fetching from ${table}:`, error)
    return null
  }
}

/**
 * Batch create multiple records
 */
export async function batchCreate<T extends AnyRecord>(
  table: string,
  records: T[]
): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(records)
      .select()

    if (error) {
      console.error(`Error batch creating in ${table}:`, error)
      throw new Error(`Failed to batch create records: ${error.message}`)
    }

    return (data as T[]) || []
  } catch (error) {
    console.error(`Exception batch creating in ${table}:`, error)
    throw error
  }
}

/**
 * Batch update multiple records
 * Note: Supabase doesn't support batch update directly, so we do individual updates
 */
export async function batchUpdate<T extends AnyRecord & { id: string }>(
  table: string,
  records: T[]
): Promise<T[]> {
  try {
    const results: T[] = []

    for (const record of records) {
      const { id, ...data } = record
      const updated = await updateRecord<T>(table, id, data as Partial<T>)  // ← FIXED
      results.push(updated)
    }

    return results
  } catch (error) {
    console.error(`Exception batch updating ${table}:`, error)
    throw error
  }
}

/**
 * Raw query execution for complex operations
 */
export async function executeRawQuery(query: string): Promise<any> {
  try {
    const { data, error } = await supabase.rpc('exec_raw_query', {
      query_text: query,
    })

    if (error) {
      console.error('Error executing raw query:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Exception executing raw query:', error)
    throw error
  }
}

/**
 * Get record count for a table with filters
 */
export async function getCount(
  table: string,
  filters?: Record<string, any>
): Promise<number> {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    const { count, error } = await query

    if (error) {
      console.error(`Error counting ${table}:`, error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error(`Exception counting ${table}:`, error)
    return 0
  }
}