import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia'
})

export interface CreatePaymentIntentOptions {
  amount: number // in cents
  currency?: string
  metadata?: Record<string, string>
  customerEmail?: string
  description?: string
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export async function createPaymentIntent(
  options: CreatePaymentIntentOptions
): Promise<PaymentIntent> {
  const {
    amount,
    currency = 'eur',
    metadata = {},
    customerEmail,
    description
  } = options

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    receipt_email: customerEmail,
    description,
    automatic_payment_methods: {
      enabled: true
    }
  })

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret!,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.confirm(paymentIntentId)
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.cancel(paymentIntentId)
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Extension point for crypto payments
export interface CryptoPaymentProvider {
  createInvoice(options: CreateCryptoInvoiceOptions): Promise<CryptoInvoice>
  getInvoiceStatus(invoiceId: string): Promise<CryptoInvoiceStatus>
}

export interface CreateCryptoInvoiceOptions {
  amount: number
  currency: string
  metadata?: Record<string, string>
  customerEmail?: string
}

export interface CryptoInvoice {
  id: string
  checkoutUrl: string
  status: string
  amount: number
  currency: string
}

export interface CryptoInvoiceStatus {
  id: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  paidAt?: string
}

// Placeholder for future crypto integration
export class CoinbaseCommerceProvider implements CryptoPaymentProvider {
  async createInvoice(options: CreateCryptoInvoiceOptions): Promise<CryptoInvoice> {
    // TODO: Implement Coinbase Commerce integration
    throw new Error('Crypto payments not configured')
  }

  async getInvoiceStatus(invoiceId: string): Promise<CryptoInvoiceStatus> {
    // TODO: Implement Coinbase Commerce status check
    throw new Error('Crypto payments not configured')
  }
}

export { stripe }
