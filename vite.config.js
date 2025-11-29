import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa' // Disabled during development

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA disabled during development to prevent caching issues
    // VitePWA({...})
  ],
  server: {
    host: true
  },
  build: {
    // Add timestamp to force cache bust
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-${Date.now()}.[ext]`
      }
    }
  }
})

