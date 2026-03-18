import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.PNG', '**/*.JPG', '**/*.JPEG'],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            // Silently handle API server unavailability in development
            // console.log('API server unavailable, returning mock response')
            // Return a mock response when the API server is unavailable
            res.writeHead(200, { 'Content-Type': 'application/json' })
            
            // Return appropriate mock responses based on the endpoint
            if (req.url.includes('/releases/featured')) {
              res.end(JSON.stringify([]))
            } else if (req.url.includes('/events/upcoming')) {
              res.end(JSON.stringify([]))
            } else if (req.url.includes('/releases')) {
              res.end(JSON.stringify([]))
            } else if (req.url.includes('/events')) {
              res.end(JSON.stringify([]))
            } else {
              res.end(JSON.stringify({ message: 'API server unavailable' }))
            }
          })
        }
      }
    }
  },
  esbuild: {
    target: 'es2020'
  }
}) 