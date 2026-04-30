import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { migrateFromLocalStorage } from './utils/db.js'
import { defineCustomElements as pwaElements } from '@capacitor/core/loader';
import { defineCustomElements as sqliteElements } from 'jeep-sqlite/loader';

pwaElements(window);
sqliteElements(window);

migrateFromLocalStorage().then(() => {
  const app = createApp(App)
  app.mount('#app')
})
