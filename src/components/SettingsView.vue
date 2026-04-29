<template>
  <div class="space-y-8 pb-24">
    <h2 class="text-2xl font-black text-gray-900">Settings & Data</h2>

    <!-- Google Sheets Sync Section -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest">
        <span class="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
        Google Sheets Sync
      </h3>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Script URL</label>
          <input 
            v-model="googleScriptUrl"
            type="password"
            placeholder="https://script.google.com/macros/s/..."
            class="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-0 transition-all bg-gray-50/50 text-sm"
          >
        </div>

        <button 
          @click="syncToGoogleSheets"
          :disabled="!googleScriptUrl || isSyncing"
          class="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-30"
        >
          <div v-if="isSyncing" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <CloudIcon v-else :size="20" />
          <span>{{ isSyncing ? 'Syncing...' : 'Sync All to Google Sheets' }}</span>
        </button>
        
        <p class="text-[10px] text-gray-400 text-center italic">
          Tip: This will append all local records to your spreadsheet.
        </p>
      </div>
    </div>

    <!-- Backup Section -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest">
        <span class="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
        Backup & Export
      </h3>
      
      <div class="space-y-4">
        <p class="text-sm text-gray-500 leading-relaxed">
          Your data is currently stored locally in your browser. You can export it as a JSON file to keep a backup or transfer it to another device.
        </p>
        
        <button 
          @click="exportData"
          class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
        >
          <DownloadIcon :size="20" />
          <span>Export coffee_logs.json</span>
        </button>

        <div class="relative">
          <input 
            type="file" 
            ref="fileInput" 
            @change="importData" 
            accept=".json" 
            class="hidden" 
          />
          <button 
            @click="$refs.fileInput.click()"
            class="w-full py-4 bg-white text-gray-900 border-2 border-gray-100 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <UploadIcon :size="20" />
            <span>Import from JSON</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Storage Management -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest">
        <span class="w-2 h-6 bg-rose-500 rounded-full mr-3"></span>
        Storage Management
      </h3>
      
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-sm font-bold text-gray-800">Local Storage Usage</div>
            <div class="text-xs text-gray-400">{{ storageSize }}</div>
          </div>
          <div class="text-xs font-black text-gray-300">ESTIMATED</div>
        </div>

        <button 
          @click="clearHistory"
          class="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center space-x-2 border border-rose-100"
        >
          <TrashIcon :size="20" />
          <span>Clear All History</span>
        </button>
      </div>
    </div>

    <!-- About Section -->
    <div class="text-center space-y-2">
      <p class="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Coffee Sensory Lexicon Note v1.0.0</p>
      <p class="text-[10px] text-gray-400">Phase 2: Persistence & Data Management</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Download as DownloadIcon, Upload as UploadIcon, Trash2 as TrashIcon, Cloud as CloudIcon } from 'lucide-vue-next';
import * as db from '../utils/db.js';

const storageSize = ref('0 KB');
const googleScriptUrl = ref(localStorage.getItem('google_script_url') || '');
const isSyncing = ref(false);

watch(googleScriptUrl, (newVal) => {
  localStorage.setItem('google_script_url', newVal);
});

const calculateStorageSize = async () => {
  const { usageMB } = await db.getStorageQuota();
  storageSize.value = `${usageMB} MB`;
};

onMounted(calculateStorageSize);

const exportData = async () => {
  const history = await db.getAllRecords();
  const blob = new Blob([JSON.stringify(history)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `coffee_logs_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (!Array.isArray(importedData)) {
        throw new Error('Invalid data format');
      }
      
      if (confirm(`Import ${importedData.length} records? This will merge with your existing history.`)) {
        db.getAllRecords().then(async history => {
          const existingIds = new Set(history.map(r => r.id));
          const newRecords = importedData.filter(r => !existingIds.has(r.id));
          
          for (const r of newRecords) {
            await db.saveRecord(r);
          }
          await calculateStorageSize();
          alert(`Successfully imported ${newRecords.length} new records!`);
          location.reload(); // Refresh to update all views
        });
      }
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
};

const syncToGoogleSheets = async () => {
  if (!googleScriptUrl.value) return;
  
  const history = await db.getAllRecords();
  
  isSyncing.value = true;
  try {
    // We use text/plain to avoid preflight OPTIONS request that GAS doesn't support well
    const response = await fetch(googleScriptUrl.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(history)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const mergedData = await response.json();
    
    // Update local storage with the merged authoritative data from cloud
    for (const r of mergedData) {
      await db.saveRecord(r);
    }
    await calculateStorageSize();
    
    alert(`Sync Successful! Cloud & Phone are now perfectly mirrored. (${mergedData.length} total records)`);
    location.reload(); // Refresh views
  } catch (err) {
    console.error('Sync error:', err);
    alert('Failed to sync: ' + err.message + '\nNote: Make sure you deployed the NEW version of GAS script.');
  } finally {
    isSyncing.value = false;
  }
};

const clearHistory = async () => {
  if (confirm('CRITICAL WARNING: This will PERMANENTLY DELETE all your coffee records. This action cannot be undone. Are you absolutely sure?')) {
    await db.clearAllRecords();
    await calculateStorageSize();
    alert('All records have been cleared.');
    location.reload();
  }
};
</script>
