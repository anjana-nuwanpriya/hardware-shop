/**
 * Hardware Shop Management System - TypeScript Types
 * Complete type definitions for all 36 database tables
 */

// ============================================================================
// ENUMS - Predefined types for constrained fields
// ============================================================================

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid'
export type TaxType = 'exclusive' | 'inclusive' | 'none'
export type TransactionType = 'in' | 'out' | 'adjustment'
export type BalanceType = 'payable' | 'receivable' | 'advance'
export type PaymentMethod = 'cash' | 'cheque' | 'bank_transfer' | 'credit'
export type CustomerType = 'retail' | 'wholesale' | 'distribution'
export type OrderStatus = 'pending' | 'completed' | 'cancelled'

// ============================================================================
// SECTION 1: MASTER DATA TABLES
// ============================================================================

/**
 * Categories - Product categories/classifications
 */
export interface Category {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Stores - Physical locations/branches
 */
export interface Store {
  id: string
  code: string
  name: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Items - Products for sale or inventory
 */
export interface Item {
  id: string
  code: string
  barcode?: string
  name: string
  description?: string
  category_id: string
  unit: string
  reorder_level?: number
  allow_negative_stock: boolean
  created_at: Date
  updated_at: Date
}

/**
 * ItemStoreStock - Current stock levels per item per store (denormalized)
 */
export interface ItemStoreStock {
  id: string
  item_id: string
  store_id: string
  quantity: number
  created_at: Date
  updated_at: Date
}

/**
 * Suppliers - Vendor information
 */
export interface Supplier {
  id: string
  code: string
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  payment_terms?: number
  opening_balance?: number
  opening_balance_type?: BalanceType
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Customers - Buyer information
 */
export interface Customer {
  id: string
  code: string
  name: string
  phone?: string
  email?: string
  address?: string
  city?: string
  credit_limit?: number
  opening_balance?: number
  opening_balance_type?: BalanceType
  customer_type?: CustomerType
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Employees - Staff members (including users)
 */
export interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// ============================================================================
// SECTION 2: OPENING BALANCES
// ============================================================================

/**
 * SupplierOpeningBalance - Initial supplier balances
 */
export interface SupplierOpeningBalance {
  id: string
  supplier_id: string
  opening_balance_type: BalanceType
  amount: number
  created_at: Date
}

/**
 * CustomerOpeningBalance - Initial customer balances
 */
export interface CustomerOpeningBalance {
  id: string
  customer_id: string
  opening_balance_type: BalanceType
  amount: number
  created_at: Date
}

// ============================================================================
// SECTION 3: PURCHASE MANAGEMENT
// ============================================================================

/**
 * PurchaseOrder - Purchase orders to suppliers
 */
export interface PurchaseOrder {
  id: string
  po_number: string
  po_date: Date
  supplier_id: string
  store_id: string
  expected_delivery_date?: Date
  total_amount: number
  remarks?: string
  status?: OrderStatus
  created_at: Date
  updated_at: Date
}

/**
 * PurchaseOrderItem - Line items in purchase orders
 */
export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  item_id: string
  quantity: number
  unit_price: number
  total_amount: number
  created_at: Date
}

/**
 * PurchaseGRN - Goods receipt notes from suppliers
 */
export interface PurchaseGRN {
  id: string
  grn_number: string
  grn_date: Date
  purchase_order_id?: string
  supplier_id: string
  store_id: string
  total_amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * PurchaseGRNItem - Line items in GRNs with batch tracking
 */
export interface PurchaseGRNItem {
  id: string
  purchase_grn_id: string
  item_id: string
  batch_no?: string
  quantity: number
  unit_cost: number
  total_cost: number
  created_at: Date
}

/**
 * PurchaseReturn - Returns to suppliers
 */
export interface PurchaseReturn {
  id: string
  return_number: string
  return_date: Date
  purchase_grn_id: string
  store_id: string
  total_amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * PurchaseReturnItem - Line items in purchase returns
 */
export interface PurchaseReturnItem {
  id: string
  purchase_return_id: string
  item_id: string
  batch_no?: string
  return_qty: number
  unit_cost: number
  total_cost: number
  created_at: Date
}

// ============================================================================
// SECTION 4: SALES MANAGEMENT
// ============================================================================

/**
 * SalesRetail - Retail invoices to customers
 */
export interface SalesRetail {
  id: string
  invoice_number: string
  invoice_date: Date
  customer_id: string
  store_id: string
  total_amount: number
  tax_type: TaxType
  tax_amount: number
  discount_amount?: number
  final_amount: number
  payment_status: PaymentStatus
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * SalesRetailItem - Line items in retail invoices
 */
export interface SalesRetailItem {
  id: string
  sales_retail_id: string
  item_id: string
  quantity: number
  unit_price: number
  discount?: number
  tax_type: TaxType
  tax_amount: number
  line_total: number
  created_at: Date
}

/**
 * SalesWholesale - Wholesale invoices to customers
 */
export interface SalesWholesale {
  id: string
  invoice_number: string
  invoice_date: Date
  customer_id: string
  store_id: string
  total_amount: number
  tax_type: TaxType
  tax_amount: number
  discount_amount?: number
  final_amount: number
  payment_status: PaymentStatus
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * SalesWholesaleItem - Line items in wholesale invoices
 */
export interface SalesWholesaleItem {
  id: string
  sales_wholesale_id: string
  item_id: string
  quantity: number
  unit_price: number
  discount?: number
  tax_type: TaxType
  tax_amount: number
  line_total: number
  created_at: Date
}

/**
 * SalesReturn - Customer returns from retail invoices
 */
export interface SalesReturn {
  id: string
  return_number: string
  return_date: Date
  sales_retail_id: string
  store_id: string
  total_amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * SalesReturnItem - Line items in customer returns
 */
export interface SalesReturnItem {
  id: string
  sales_return_id: string
  item_id: string
  return_qty: number
  unit_price: number
  total_amount: number
  created_at: Date
}

/**
 * SalesWholesaleReturn - Customer returns from wholesale invoices
 */
export interface SalesWholesaleReturn {
  id: string
  return_number: string
  return_date: Date
  sales_wholesale_id: string
  store_id: string
  total_amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * SalesWholesaleReturnItem - Line items in wholesale customer returns
 */
export interface SalesWholesaleReturnItem {
  id: string
  sales_wholesale_return_id: string
  item_id: string
  return_qty: number
  unit_price: number
  total_amount: number
  created_at: Date
}

/**
 * Quotation - Sales quotations to customers
 */
export interface Quotation {
  id: string
  quotation_number: string
  quotation_date: Date
  customer_id: string
  store_id: string
  total_amount: number
  expires_at?: Date
  status?: OrderStatus
  created_at: Date
  updated_at: Date
}

/**
 * QuotationItem - Line items in quotations
 */
export interface QuotationItem {
  id: string
  quotation_id: string
  item_id: string
  quantity: number
  unit_price: number
  discount?: number
  tax_type: TaxType
  tax_amount: number
  line_total: number
  created_at: Date
}

// ============================================================================
// SECTION 5: PAYMENT MANAGEMENT
// ============================================================================

/**
 * SupplierPayment - Payments made to suppliers
 */
export interface SupplierPayment {
  id: string
  payment_number: string
  payment_date: Date
  supplier_id: string
  payment_method: PaymentMethod
  amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * SupplierPaymentAllocation - Links payments to specific GRNs
 */
export interface SupplierPaymentAllocation {
  id: string
  supplier_payment_id: string
  purchase_grn_id: string
  grn_amount: number
  grn_paid_amount: number
  grn_outstanding: number
  allocation_amount: number
  created_at: Date
}

/**
 * CustomerPayment - Payments received from customers
 */
export interface CustomerPayment {
  id: string
  payment_number: string
  payment_date: Date
  customer_id: string
  payment_method: PaymentMethod
  amount: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * CustomerPaymentAllocation - Links payments to specific invoices
 */
export interface CustomerPaymentAllocation {
  id: string
  customer_payment_id: string
  sales_invoice_id: string
  invoice_amount: number
  paid_amount: number
  outstanding: number
  allocation_amount: number
  created_at: Date
}

// ============================================================================
// SECTION 6: INVENTORY MANAGEMENT
// ============================================================================

/**
 * InventoryTransaction - Audit trail of all stock movements
 */
export interface InventoryTransaction {
  id: string
  item_id: string
  store_id: string
  transaction_type: TransactionType
  batch_no?: string
  quantity: number
  cost_per_unit?: number
  reference_type?: string
  reference_id?: string
  created_at: Date
}

/**
 * OpeningStockEntry - Opening stock entry batches
 */
export interface OpeningStockEntry {
  id: string
  entry_number: string
  entry_date: Date
  store_id: string
  prepared_by?: string
  total_items?: number
  remarks?: string
  created_at: Date
  updated_at: Date
}

/**
 * OpeningStockItem - Line items in opening stock
 */
export interface OpeningStockItem {
  id: string
  opening_stock_entry_id: string
  item_id: string
  batch_no?: string
  quantity: number
  cost_per_unit: number
  total_cost: number
  created_at: Date
}

/**
 * StockAdjustment - Manual stock corrections/adjustments
 */
export interface StockAdjustment {
  id: string
  adjustment_number: string
  adjustment_date: Date
  store_id: string
  description?: string
  reason?: string
  employee_id?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * StockAdjustmentItem - Line items in stock adjustments
 */
export interface StockAdjustmentItem {
  id: string
  stock_adjustment_id: string
  item_id: string
  batch_no?: string
  current_stock?: number
  adjustment_qty: number
  adjustment_reason?: string
  remarks?: string
  created_at: Date
}

// ============================================================================
// SECTION 7: AUDIT & SYSTEM
// ============================================================================

/**
 * AuditLog - Complete change history for compliance
 */
export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: Date
}

/**
 * SystemSetting - Application configuration settings
 */
export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: string
  setting_type?: string
  created_at: Date
  updated_at: Date
}

// ============================================================================
// UNION TYPES - For generic operations
// ============================================================================

/**
 * AnyEntity - Union of all entity types
 */
export type AnyEntity =
  | Category
  | Store
  | Item
  | ItemStoreStock
  | Supplier
  | Customer
  | Employee
  | SupplierOpeningBalance
  | CustomerOpeningBalance
  | PurchaseOrder
  | PurchaseOrderItem
  | PurchaseGRN
  | PurchaseGRNItem
  | PurchaseReturn
  | PurchaseReturnItem
  | SalesRetail
  | SalesRetailItem
  | SalesWholesale
  | SalesWholesaleItem
  | SalesReturn
  | SalesReturnItem
  | SalesWholesaleReturn
  | SalesWholesaleReturnItem
  | Quotation
  | QuotationItem
  | SupplierPayment
  | SupplierPaymentAllocation
  | CustomerPayment
  | CustomerPaymentAllocation
  | InventoryTransaction
  | OpeningStockEntry
  | OpeningStockItem
  | StockAdjustment
  | StockAdjustmentItem
  | AuditLog
  | SystemSetting

/**
 * AnyRecord - Generic record type for flexible operations
 */
export type AnyRecord = Record<string, any>