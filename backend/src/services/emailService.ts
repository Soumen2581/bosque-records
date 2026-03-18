import nodemailer from 'nodemailer'

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'placeholder@example.com',
    pass: process.env.SMTP_PASS || 'placeholder_password'
  }
})

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions = {
    from: options.from || process.env.SMTP_FROM || 'Bosque Records <noreply@bosquerecords.com>',
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''),
    replyTo: options.replyTo || 'info@bosquerecords.com'
  }

  if (process.env.SMTP_ENABLED !== 'true') {
    console.log('[Email] SMTP not enabled. Would send:', mailOptions)
    return
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('[Email] Sent to:', mailOptions.to)
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    throw error
  }
}

export async function sendOrderConfirmation(
  order: {
    orderNumber: string
    customerEmail: string
    customerName: string
    total: number
    items: Array<{
      productName: string
      quantity: number
      price: number
      variant?: string
    }>
    shippingAddress?: {
      name?: string
      street?: string
      city?: string
      postalCode?: string
      country?: string
    }
    paymentMethod: string
  }
): Promise<void> {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #14331e;">
          ${item.productName}
          ${item.variant ? `<br><small style="color: #a1a1aa;">${item.variant}</small>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #14331e; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #14331e; text-align: right;">
          €${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('')

  const shippingHtml = order.shippingAddress
    ? `
      <h3 style="color: #d4af37; margin-top: 24px;">Shipping Address</h3>
      <p style="color: #e5e5e5;">
        ${order.shippingAddress.name || ''}<br>
        ${order.shippingAddress.street || ''}<br>
        ${order.shippingAddress.postalCode || ''} ${order.shippingAddress.city || ''}<br>
        ${order.shippingAddress.country || ''}
      </p>
    `
    : '<p style="color: #a1a1aa;"><em>Digital order - no shipping required</em></p>'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #14331e; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #14331e 0%, #0a0a0a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
        .header p { color: #a1a1aa; margin: 8px 0 0; }
        .content { padding: 30px; }
        h2 { color: #d4af37; }
        h3 { color: #2a7a4a; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #14331e; color: #d4af37; padding: 12px; text-align: left; }
        .total { font-size: 20px; color: #d4af37; text-align: right; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #a1a1aa; font-size: 12px; border-top: 1px solid #14331e; }
        .button { display: inline-block; background: #d4af37; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✧ Bosque Records ✧</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${order.customerName}!</h2>
          <p>Your order <strong style="color: #d4af37;">#${order.orderNumber}</strong> has been received.</p>
          
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p class="total">Total: €${order.total.toFixed(2)}</p>
          
          <p style="color: #a1a1aa; font-size: 14px;">
            Payment method: ${order.paymentMethod === 'stripe' ? '💳 Card Payment' : order.paymentMethod === 'sepa' ? '🏦 SEPA Transfer' : '📄 Bank Transfer'}
          </p>
          
          ${shippingHtml}
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://bosquerecords.com/track/${order.orderNumber}" class="button">
              Track Your Order
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Bosque Records | Dark Forest Psytrance Label</p>
          <p>North Carolina, United States</p>
          <p style="margin-top: 15px;">
            Questions? Contact us at <a href="mailto:info@bosquerecords.com" style="color: #d4af37;">info@bosquerecords.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderNumber} - Bosque Records`,
    html
  })
}

export async function sendDigitalDownloadAccess(
  order: {
    orderNumber: string
    customerEmail: string
    customerName: string
    items: Array<{
      productName: string
      downloadMp3?: string
      downloadWav?: string
    }>
  }
): Promise<void> {
  const itemsHtml = order.items
    .filter((item) => item.downloadMp3 || item.downloadWav)
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #14331e;">
          <strong style="color: #e5e5e5;">${item.productName}</strong>
          <div style="margin-top: 12px;">
            ${item.downloadMp3 ? `<a href="${item.downloadMp3}" style="color: #d4af37;">🎵 Download MP3</a>` : ''}
            ${item.downloadMp3 && item.downloadWav ? ' | ' : ''}
            ${item.downloadWav ? `<a href="${item.downloadWav}" style="color: #d4af37;">🎼 Download WAV</a>` : ''}
          </div>
        </td>
      </tr>
    `
    )
    .join('')

  if (!itemsHtml) return // No digital items

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #14331e; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #14331e 0%, #0a0a0a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: #d4af37; margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        h2 { color: #d4af37; }
        table { width: 100%; border-collapse: collapse; }
        .footer { text-align: center; padding: 20px; color: #a1a1aa; font-size: 12px; border-top: 1px solid #14331e; }
        .button { display: inline-block; background: #d4af37; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✧ Bosque Records ✧</h1>
          <p>Your Downloads Are Ready!</p>
        </div>
        <div class="content">
          <h2>Hello ${order.customerName},</h2>
          <p>Thank you for your purchase! Your digital downloads are ready.</p>
          <p><strong>Order:</strong> #${order.orderNumber}</p>
          
          <h3 style="color: #2a7a4a;">Your Downloads</h3>
          <table>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p style="color: #a1a1aa; font-size: 14px; margin-top: 20px;">
            ⚠️ Download links expire in 30 days. Links are also available in your account library.
          </p>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://bosquerecords.com/account/library" class="button">
              Go to Your Library
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Bosque Records | Dark Forest Psytrance Label</p>
          <p>Questions? Contact us at <a href="mailto:info@bosquerecords.com" style="color: #d4af37;">info@bosquerecords.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.customerEmail,
    subject: `Your Downloads Are Ready - Order #${order.orderNumber} - Bosque Records`,
    html
  })
}

export async function sendOrderStatusUpdate(
  order: {
    orderNumber: string
    customerEmail: string
    customerName: string
    status: string
    trackingNumber?: string
  }
): Promise<void> {
  const statusMessages: Record<string, string> = {
    paid: 'Your payment has been confirmed.',
    processing: 'Your order is being prepared.',
    shipped: 'Your order has been shipped!',
    delivered: 'Your order has been delivered.',
    cancelled: 'Your order has been cancelled.',
    refunded: 'Your order has been refunded.'
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #14331e; border-radius: 8px; }
        .header { background: #14331e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: #d4af37; margin: 0; }
        .content { padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #a1a1aa; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✧ Bosque Records ✧</h1>
        </div>
        <div class="content">
          <h2>Order Update</h2>
          <p>Hello ${order.customerName},</p>
          <p>${statusMessages[order.status] || `Your order status is: ${order.status}`}</p>
          <p><strong>Order:</strong> #${order.orderNumber}</p>
          ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
          <p style="margin-top: 30px;">
            <a href="https://bosquerecords.com/track/${order.orderNumber}" style="color: #d4af37;">Track Your Order</a>
          </p>
        </div>
        <div class="footer">
          <p>Bosque Records | info@bosquerecords.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: order.customerEmail,
    subject: `Order Update #${order.orderNumber} - Bosque Records`,
    html
  })
}
