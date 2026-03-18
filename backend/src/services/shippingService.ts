// Shipping configuration
const SHIPPING_CONFIG = {
  flatRate: parseFloat(process.env.SHIPPING_FLAT_RATE || '7.50'), // €7.50
  freeShippingThreshold: parseFloat(process.env.SHIPPING_FREE_THRESHOLD || '75.00'), // €75
  freeShippingEnabled: process.env.SHIPPING_FREE_ENABLED !== 'false'
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  productType: 'physical' | 'digital' | 'vinyl'
  weight?: number // grams
}

export interface ShippingCalculation {
  hasPhysicalItems: boolean
  subtotal: number
  shippingCost: number
  total: number
  freeShipping: boolean
}

export function calculateShipping(items: CartItem[]): ShippingCalculation {
  const physicalItems = items.filter(
    (item) => item.productType === 'physical' || item.productType === 'vinyl'
  )
  
  const hasPhysicalItems = physicalItems.length > 0
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  let shippingCost = 0
  let freeShipping = false
  
  if (hasPhysicalItems && SHIPPING_CONFIG.freeShippingEnabled) {
    if (subtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
      freeShipping = true
      shippingCost = 0
    } else {
      shippingCost = SHIPPING_CONFIG.flatRate
    }
  }
  
  return {
    hasPhysicalItems,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    freeShipping
  }
}

export function getShippingInfo() {
  return {
    flatRate: SHIPPING_CONFIG.flatRate,
    freeShippingThreshold: SHIPPING_CONFIG.freeShippingThreshold,
    freeShippingEnabled: SHIPPING_CONFIG.freeShippingEnabled,
    currency: 'EUR',
    estimate: SHIPPING_CONFIG.freeShippingEnabled
      ? `Free shipping on orders over €${SHIPPING_CONFIG.freeShippingThreshold.toFixed(2)}`
      : `Flat rate shipping: €${SHIPPING_CONFIG.flatRate.toFixed(2)} per order`
  }
}

// EU VAT calculation (simplified - for real implementation, use a tax service)
const EU_VAT_RATES: Record<string, number> = {
  DE: 0.19, // Germany
  FR: 0.20, // France
  IT: 0.22, // Italy
  ES: 0.21, // Spain
  NL: 0.21, // Netherlands
  BE: 0.21, // Belgium
  AT: 0.20, // Austria
  PL: 0.23, // Poland
  PT: 0.23, // Portugal
  GR: 0.24, // Greece
  SE: 0.25, // Sweden
  DK: 0.25, // Denmark
  FI: 0.24, // Finland
  IE: 0.23, // Ireland
  CZ: 0.21, // Czech Republic
  HU: 0.27, // Hungary
  RO: 0.19, // Romania
  SK: 0.20, // Slovakia
  BG: 0.20, // Bulgaria
  HR: 0.25, // Croatia
  SI: 0.22, // Slovenia
  LT: 0.21, // Lithuania
  LV: 0.21, // Latvia
  EE: 0.20, // Estonia
  MT: 0.18, // Malta
  CY: 0.19, // Cyprus
  LU: 0.17, // Luxembourg
  // Non-EU
  GB: 0.0, // UK (post-Brexit, no VAT for digital goods)
  CH: 0.0, // Switzerland
  NO: 0.0, // Norway
  US: 0.0  // USA (varies by state, simplified here)
}

export function getVATRate(countryCode: string): number {
  return EU_VAT_RATES[countryCode.toUpperCase()] || 0
}

export function calculateTax(amount: number, countryCode: string): number {
  const rate = getVATRate(countryCode)
  return Math.round(amount * rate * 100) / 100
}

// SEPA bank details (configured via environment)
export const SEPA_CONFIG = {
  bankName: process.env.SEPA_BANK_NAME || 'Placeholder Bank',
  iban: process.env.SEPA_IBAN || 'DE00 0000 0000 0000 0000 00',
  bic: process.env.SEPA_BIC || 'XXXXXXXXXXX',
  accountHolder: process.env.SEPA_ACCOUNT_HOLDER || 'Bosque Records',
  reference: 'Order {orderNumber}' // Will be replaced with actual order number
}

export function getSEPAInstructions(orderNumber: string) {
  return {
    bankName: SEPA_CONFIG.bankName,
    iban: SEPA_CONFIG.iban,
    bic: SEPA_CONFIG.bic,
    accountHolder: SEPA_CONFIG.accountHolder,
    amount: 'See your order total',
    reference: `Order ${orderNumber}`,
    instructions: `
      Please transfer the total amount to the account above.
      Use your order number as the payment reference.
      Your order will be processed once payment is received (usually 2-5 business days).
    `.trim()
  }
}
