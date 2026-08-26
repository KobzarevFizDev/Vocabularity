import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('..', import.meta.url)), '')

  const backendUrl = env.BACKEND_URL || `http://${env.BACKEND_HOST || '127.0.0.1'}:${env.BACKEND_PORT || '8000'}`
  const frontendPort = Number(env.FRONTEND_PORT || 5173)

  return {
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/ws': {
          target: backendUrl,
          ws: true,
        },
      },
    },
    plugins: [react()],
  }
})
