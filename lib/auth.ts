/**
 * Authentication Utilities
 * Functions for authentication and session management
 */

import { supabase } from './supabase'

/**
 * User type from Supabase Auth
 */
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: AuthUser | null
  error: string | null
}

/**
 * Login user with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: data.user as any,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

/**
 * Register new user
 */
export async function registerUser(
  email: string,
  password: string,
  metadata?: Record<string, any>
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: data.user as any,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Registration failed',
    }
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: null,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Logout failed',
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user as any
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Reset password for user
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: null,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Password reset failed',
    }
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: data.user as any,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Password update failed',
    }
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  metadata: Record<string, any>
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: data.user as any,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Metadata update failed',
    }
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Get user ID
 */
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id || null
}

/**
 * Get user email
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.email || null
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as any)
  })

  return subscription
}

/**
 * Refresh auth session
 */
export async function refreshSession(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return {
      user: data.user as any,
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Session refresh failed',
    }
  }
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    return user !== null
  } catch (error) {
    return false
  }
}