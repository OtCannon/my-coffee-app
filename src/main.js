import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { migrateFromLocalStorage } from './utils/db.js'

migrateFromLocalStorage().then(() => {
  const app = createApp(App)
  app.mount('#app')
})
