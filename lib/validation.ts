/**
 * Form Validation Schemas
 * Using Zod for runtime validation of form data
 */

import { z } from 'zod'

/**
 * Login Form Schema
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof LoginSchema>

/**
 * Create Supplier Schema
 */
export const CreateSupplierSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50, 'Code must be less than 50 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  contact_person: z.string().max(100, 'Contact person must be less than 100 characters').optional(),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\(\)]*$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  payment_terms: z
    .number()
    .positive('Payment terms must be positive')
    .optional(),
  opening_balance: z
    .number()
    .nonnegative('Opening balance cannot be negative')
    .optional(),
  opening_balance_type: z
    .enum(['payable', 'receivable', 'advance'])
    .optional(),
})

export type CreateSupplierData = z.infer<typeof CreateSupplierSchema>

/**
 * Create Customer Schema
 */
export const CreateCustomerSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50, 'Code must be less than 50 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\(\)]*$/, 'Invalid phone number')
    .optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  credit_limit: z
    .number()
    .nonnegative('Credit limit cannot be negative')
    .optional(),
  customer_type: z
    .enum(['retail', 'wholesale', 'distribution'])
    .optional(),
  opening_balance: z
    .number()
    .nonnegative('Opening balance cannot be negative')
    .optional(),
  opening_balance_type: z
    .enum(['payable', 'receivable', 'advance'])
    .optional(),
})

export type CreateCustomerData = z.infer<typeof CreateCustomerSchema>

/**
 * Create Item Schema
 */
export const CreateItemSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50, 'Code must be less than 50 characters'),
  barcode: z
    .string()
    .max(100, 'Barcode must be less than 100 characters')
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  category_id: z
    .string()
    .uuid('Invalid category ID'),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
  reorder_level: z
    .number()
    .nonnegative('Reorder level cannot be negative')
    .optional(),
  allow_negative_stock: z.boolean().default(false),
})

export type CreateItemData = z.infer<typeof CreateItemSchema>

/**
 * Create Category Schema
 */
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
})

export type CreateCategoryData = z.infer<typeof CreateCategorySchema>

/**
 * Create Store Schema
 */
export const CreateStoreSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50, 'Code must be less than 50 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

export type CreateStoreData = z.infer<typeof CreateStoreSchema>

/**
 * Create Sales Invoice Line Item Schema
 */
export const SalesLineItemSchema = z.object({
  item_id: z.string().uuid('Invalid item ID'),
  quantity: z
    .number()
    .positive('Quantity must be greater than 0'),
  unit_price: z
    .number()
    .positive('Unit price must be greater than 0'),
  discount: z
    .number()
    .nonnegative('Discount cannot be negative')
    .optional(),
})

export type SalesLineItemData = z.infer<typeof SalesLineItemSchema>

/**
 * Create Sales Invoice Schema (Retail)
 */
export const CreateSalesRetailSchema = z.object({
  customer_id: z.string().uuid('Invalid customer ID'),
  store_id: z.string().uuid('Invalid store ID'),
  invoice_date: z.date().optional(),
  items: z
    .array(SalesLineItemSchema)
    .min(1, 'At least one item is required'),
  tax_type: z.enum(['exclusive', 'inclusive', 'none']).default('exclusive'),
  discount_amount: z
    .number()
    .nonnegative('Discount cannot be negative')
    .optional(),
  remarks: z.string().optional(),
})

export type CreateSalesRetailData = z.infer<typeof CreateSalesRetailSchema>

/**
 * Create Sales Invoice Schema (Wholesale)
 */
export const CreateSalesWholesaleSchema = z.object({
  customer_id: z.string().uuid('Invalid customer ID'),
  store_id: z.string().uuid('Invalid store ID'),
  invoice_date: z.date().optional(),
  items: z
    .array(SalesLineItemSchema)
    .min(1, 'At least one item is required'),
  tax_type: z.enum(['exclusive', 'inclusive', 'none']).default('exclusive'),
  discount_amount: z
    .number()
    .nonnegative('Discount cannot be negative')
    .optional(),
  remarks: z.string().optional(),
})

export type CreateSalesWholesaleData = z.infer<typeof CreateSalesWholesaleSchema>

/**
 * Create Payment Schema
 */
export const CreatePaymentSchema = z.object({
  payment_date: z.date(),
  payment_method: z.enum(['cash', 'cheque', 'bank_transfer', 'credit']),
  amount: z
    .number()
    .positive('Amount must be greater than 0'),
  remarks: z.string().optional(),
})

export type CreatePaymentData = z.infer<typeof CreatePaymentSchema>

/**
 * Payment Allocation Schema
 */
export const PaymentAllocationSchema = z.object({
  invoice_id: z.string().uuid('Invalid invoice ID'),
  allocation_amount: z
    .number()
    .positive('Allocation amount must be greater than 0'),
})

export type PaymentAllocationData = z.infer<typeof PaymentAllocationSchema>

/**
 * Stock Adjustment Item Schema
 */
export const StockAdjustmentItemSchema = z.object({
  item_id: z.string().uuid('Invalid item ID'),
  adjustment_qty: z
    .number()
    .refine((n) => n !== 0, 'Adjustment quantity cannot be zero'),
  adjustment_reason: z.string().optional(),
})

export type StockAdjustmentItemData = z.infer<
  typeof StockAdjustmentItemSchema
>

/**
 * Create Stock Adjustment Schema
 */
export const CreateStockAdjustmentSchema = z.object({
  adjustment_date: z.date(),
  store_id: z.string().uuid('Invalid store ID'),
  items: z
    .array(StockAdjustmentItemSchema)
    .min(1, 'At least one item is required'),
  description: z.string().optional(),
  reason: z.string().optional(),
})

export type CreateStockAdjustmentData = z.infer<
  typeof CreateStockAdjustmentSchema
>

/**
 * Generic validation function
 */
export async function validate<T>(
  schema: z.ZodSchema,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: z.ZodError }> {
  try {
    const result = await schema.parseAsync(data)
    return { success: true, data: result as T }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * Format Zod errors into a simple object
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  })

  return errors
}