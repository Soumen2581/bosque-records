import { app, prisma } from './app'

app.listen(3001)

console.log('🌿 Bosque Records API running on http://localhost:3001')

process.on('SIGINT', async () => {
  console.log('\n🌙 Shutting down Bosque Records API...')
  await prisma.$disconnect()
  process.exit(0)
})
