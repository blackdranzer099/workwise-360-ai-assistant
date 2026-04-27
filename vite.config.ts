import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy SnapLogic API requests to bypass CORS in development
      '/snaplogic-api': {
        target: 'https://prod-srivensandbox-cloud-fm.snaplogic.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/snaplogic-api/, ''),
      },
    },
  },
})
