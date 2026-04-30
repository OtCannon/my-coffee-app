import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/my-coffee-app/' : '/',
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/icon-512.png', 'coffee.sqlite'],
      manifest: {
        name: 'Coffee Log',
        short_name: 'CoffeeLog',
        description: 'Professional coffee sensory logging application.',
        theme_color: '#b45309',
        background_color: '#f8f9fa',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: 'icons/icon-512.png', // 使用相對路徑
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,sqlite}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'font' || request.destination === 'style',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})
