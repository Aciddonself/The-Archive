import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    },
    define: {
      'import.meta.env.VITE_INSFORGE_URL': JSON.stringify(env.VITE_INSFORGE_URL || 'https://envjj7hu.us-east.insforge.app')
    }
  }
})
