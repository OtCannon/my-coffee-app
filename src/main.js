import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// 註冊 Service Worker，確保 PWA 功能與快取更新
registerSW({ immediate: true })

const app = createApp(App)
app.mount('#app')
