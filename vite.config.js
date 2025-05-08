import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/cibv-pwa/', // 👈 Set this to match your repo name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Casey Indoor Beach Volleyball',
        short_name: 'CIBV',
        start_url: '/cibv-pwa/', // 👈 Match base path
        display: 'standalone',
        background_color: '#121212',
        theme_color: '#121212',
        icons: [
          {
            src: '/cibv-pwa/web-app-manifest-192x192.png', // 👈 Prefix with base
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/cibv-pwa/web-app-manifest-512x512.png', // 👈 Prefix with base
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})