import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { migrateFromLocalStorage } from './utils/recordStore.js'
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'

jeepSqlite(window)

migrateFromLocalStorage().then(() => {
  const app = createApp(App)
  app.mount('#app')
})
