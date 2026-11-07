import { afterAll, describe, expect, test } from 'bun:test'
import { createApp, prisma } from './app'

const app = createApp({ serveStatic: false })

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Bosque Records API', () => {
  test('health root responds with running status', async () => {
    const response = await app.handle(new Request('http://localhost/'))
    expect(response.status).toBe(200)
    const body = await response.json() as { status?: string; message?: string }
    expect(body.status).toBe('running')
    expect(body.message).toBe('Bosque Records API')
  })

  test('artists endpoint responds without crashing', async () => {
    const response = await app.handle(new Request('http://localhost/api/v1/artists'))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body === null || typeof body === 'object').toBe(true)
  })

  test('featured releases endpoint responds without crashing', async () => {
    const response = await app.handle(new Request('http://localhost/api/v1/releases/featured'))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body) || (body !== null && typeof body === 'object')).toBe(true)
  })
})
