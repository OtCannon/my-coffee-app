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
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/icon-512.png'],
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache'
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
