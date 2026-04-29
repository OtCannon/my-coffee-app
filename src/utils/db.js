const DB_NAME = 'coffee-log-db'
const DB_VERSION = 1
const STORE_NAME = 'records'

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

/**
 * Executes a transaction and returns a Promise.
 * @param {string} mode - 'readonly' or 'readwrite'
 * @param {Function} operation - Callback taking the object store
 * @returns {Promise<any>}
 */
const withStore = async (mode, operation) => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], mode)
    const store = transaction.objectStore(STORE_NAME)
    
    let result
    try {
      result = operation(store)
    } catch (err) {
      reject(err)
      return
    }

    transaction.oncomplete = () => resolve(result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(new Error('Transaction aborted'))
  })
}

/**
 * Get all records from the database.
 * @returns {Promise<Array>}
 */
export const getAllRecords = async () => {
  return await withStore('readonly', (store) => {
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  })
}

/**
 * Add or update a record.
 * @param {Object} record 
 * @returns {Promise<void>}
 */
export const saveRecord = async (record) => {
  await withStore('readwrite', (store) => {
    store.put(record)
  })
}

/**
 * Delete a record by ID.
 * @param {string} id 
 * @returns {Promise<void>}
 */
export const deleteRecord = async (id) => {
  await withStore('readwrite', (store) => {
    store.delete(id)
  })
}

/**
 * Clear all records.
 * @returns {Promise<void>}
 */
export const clearAllRecords = async () => {
  await withStore('readwrite', (store) => {
    store.clear()
  })
}

/**
 * Migrates data from localStorage to IndexedDB if it exists.
 * @returns {Promise<void>}
 */
export const migrateFromLocalStorage = async () => {
  const localData = localStorage.getItem('coffee_history')
  if (localData) {
    try {
      const records = JSON.parse(localData)
      if (Array.isArray(records) && records.length > 0) {
        console.log('Migrating data from localStorage to IndexedDB...')
        // We use a single transaction for all records to ensure atomicity
        await withStore('readwrite', (store) => {
          records.forEach(record => store.put(record))
        })
        console.log('Migration successful.')
        
        // Backup the original localStorage and remove the key to prevent double migration
        localStorage.setItem('coffee_history_backup', localData)
        localStorage.removeItem('coffee_history')
      }
    } catch (err) {
      console.error('Failed to migrate data from localStorage:', err)
    }
  }
}

/**
 * Get the storage quota and usage.
 * @returns {Promise<{usageMB: string, quotaMB: string, percentage: string}>}
 */
export const getStorageQuota = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimation = await navigator.storage.estimate()
    const usageMB = (estimation.usage / (1024 * 1024)).toFixed(2)
    const quotaMB = (estimation.quota / (1024 * 1024)).toFixed(2)
    const percentage = ((estimation.usage / estimation.quota) * 100).toFixed(2)
    return { usageMB, quotaMB, percentage }
  }
  return { usageMB: '0.00', quotaMB: '0.00', percentage: '0.00' }
}
