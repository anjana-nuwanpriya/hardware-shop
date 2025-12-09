/**
 * Application Configuration
 * Centralized configuration from environment variables
 */

/**
 * Environment variable helper with fallback
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`]
  
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  
  return value || defaultValue || ''
}

/**
 * Main configuration object
 */
export const config = {
  // Application metadata
  appName: getEnv('NEXT_PUBLIC_APP_NAME', 'Hardware Shop Management System'),
  appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  environment: process.env.NODE_ENV || 'development',

  // Localization
  currency: getEnv('NEXT_PUBLIC_CURRENCY', 'LKR'),
  timezone: getEnv('NEXT_PUBLIC_TIMEZONE', 'Asia/Colombo'),

  // Business rules
  allowNegativeStock: getEnv('NEXT_PUBLIC_ALLOW_NEGATIVE_STOCK', 'false') === 'true',
  lowStockThreshold: parseInt(getEnv('NEXT_PUBLIC_LOW_STOCK_THRESHOLD', '10'), 10),
  defaultTaxRate: parseFloat(getEnv('NEXT_PUBLIC_DEFAULT_TAX_RATE', '18')),
  defaultDiscountPercent: parseFloat(getEnv('NEXT_PUBLIC_DEFAULT_DISCOUNT_PERCENT', '0')),

  // Features
  enableEmailNotifications: getEnv('NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS', 'false') === 'true',
  enableSmsNotifications: getEnv('NEXT_PUBLIC_ENABLE_SMS_NOTIFICATIONS', 'false') === 'true',

  // Formatting
  decimalPlaces: {
    display: 2,
    calculation: 4,
  },

  // Supabase (for reference, loaded from environment)
  supabase: {
    url: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
} as const

/**
 * Type for configuration object
 */
export type Config = typeof config

/**
 * Format currency amount
 * @example formatCurrency(1234.56) => "Rs. 1,234.56"
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.decimalPlaces.display,
    maximumFractionDigits: config.decimalPlaces.display,
  }).format(amount)

  return formatted
}

/**
 * Format number with specified decimal places
 */
export function formatNumber(
  value: number,
  decimals: number = config.decimalPlaces.display
): string {
  return value.toFixed(decimals)
}

/**
 * Round number to specified decimal places
 */
export function roundNumber(
  value: number,
  decimals: number = config.decimalPlaces.calculation
): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Format date for display
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
 * Format datetime for display
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
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('en-LK', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

/**
 * Get current date in application timezone
 */
export function getCurrentDate(): Date {
  return new Date()
}

/**
 * Get current datetime string (ISO format)
 */
export function getCurrentDateTimeISO(): string {
  return new Date().toISOString()
}

/**
 * Validate if an amount is non-negative
 */
export function isValidAmount(amount: any): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num >= 0
}

/**
 * Validate if a quantity is positive
 */
export function isValidQuantity(quantity: any): boolean {
  const num = parseFloat(quantity)
  return !isNaN(num) && num > 0
}

/**
 * Get business rule: can stock go negative?
 */
export function canStockBeNegative(): boolean {
  return config.allowNegativeStock
}

/**
 * Get business rule: low stock threshold
 */
export function getLowStockThreshold(): number {
  return config.lowStockThreshold
}

/**
 * Get business rule: default tax rate
 */
export function getDefaultTaxRate(): number {
  return config.defaultTaxRate
}

/**
 * Validate configuration on startup
 */
export function validateConfig(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = requiredEnvVars.filter((key) => !process.env[key])

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
  }
}

/**
 * Get configuration summary (safe for logging)
 */
export function getConfigSummary() {
  return {
    appName: config.appName,
    environment: config.environment,
    currency: config.currency,
    timezone: config.timezone,
    allowNegativeStock: config.allowNegativeStock,
    lowStockThreshold: config.lowStockThreshold,
    defaultTaxRate: config.defaultTaxRate,
  }
}

export default config