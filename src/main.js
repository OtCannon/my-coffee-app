import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// 斷線偵錯：如果斷線後還能看到這行，代表 JS 載入成功
const status = navigator.onLine ? "✅ 連線中" : "⚠️ 離線中";
alert("App 啟動測試 (" + status + ")");

registerSW({ immediate: true })

const app = createApp(App)
app.mount('#app')
