import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    // Define global constants for environment detection
    __IS_VERCEL__: JSON.stringify(!!process.env.VERCEL),
    __USE_MOCK_DATA__: JSON.stringify(process.env.VITE_USE_MOCK === 'true' || !!process.env.VERCEL)
  }
})