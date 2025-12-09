/**
 * General Utility Functions
 * Helper functions for common operations
 */

import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a UUID
 */
export function generateId(): string {
  return uuidv4()
}

/**
 * Generate a unique code with prefix
 * Example: SUP-001, CUS-001
 */
export function generateCode(prefix: string, timestamp = true): string {
  const time = timestamp ? Date.now().toString().slice(-6) : ''
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${prefix}-${time}${random}`.slice(0, 20)
}

/**
 * Format currency amount with LKR symbol
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Parse string to decimal number (safe)
 */
export function parseDecimal(value: string | number, decimals: number = 2): number {
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return 0
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  } catch {
    return 0
  }
}

/**
 * Round number to specified decimals
 */
export function roundNumber(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Get current date
 */
export function getCurrentDate(): Date {
  return new Date()
}

/**
 * Get current datetime as ISO string
 */
export function getCurrentDateTimeISO(): string {
  return new Date().toISOString()
}

/**
 * Calculate tax based on type
 */
export function calculateTax(
  amount: number,
  taxRate: number,
  taxType: 'exclusive' | 'inclusive' | 'none'
): { tax: number; total: number } {
  if (taxType === 'none') {
    return { tax: 0, total: amount }
  }

  const rate = taxRate / 100

  if (taxType === 'exclusive') {
    const tax = roundNumber(amount * rate)
    const total = roundNumber(amount + tax)
    return { tax, total }
  }

  // inclusive
  const tax = roundNumber(amount - amount / (1 + rate))
  return { tax, total: amount }
}

/**
 * Validate stock availability
 */
export function validateStockAvailability(
  currentStock: number,
  requestedQty: number,
  allowNegative: boolean
): { allowed: boolean; error?: string } {
  if (requestedQty <= 0) {
    return { allowed: false, error: 'Quantity must be greater than 0' }
  }

  if (!allowNegative && currentStock < requestedQty) {
    return {
      allowed: false,
      error: `Insufficient stock. Available: ${currentStock}, Requested: ${requestedQty}`,
    }
  }

  return { allowed: true }
}

/**
 * Calculate outstanding amount
 */
export function calculateOutstanding(
  openingBalance: number,
  invoiceTotal: number,
  paidAmount: number
): number {
  return roundNumber(openingBalance + invoiceTotal - paidAmount)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phone.length >= 7 && phoneRegex.test(phone)
}

/**
 * Get IP address from headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  return forwarded?.split(',')[0].trim() || realIp || 'unknown'
}

/**
 * Get user agent from headers
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}

/**
 * Sleep/delay function
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export function merge<T extends object>(
  target: T,
  source: Partial<T>
): T {
  return { ...target, ...source }
}

/**
 * Extract numeric value from string
 */
export function extractNumber(str: string): number {
  const match = str.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * Get query parameter from URL
 */
export function getQueryParam(key: string, url?: string): string | null {
  const searchParams = new URLSearchParams(
    url ? new URL(url).search : typeof window !== 'undefined' ? window.location.search : ''
  )
  return searchParams.get(key)
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}