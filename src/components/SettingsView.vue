<template>
  <div class="space-y-8 pb-24">
    <h2 class="text-2xl font-black text-gray-900">Settings & Data</h2>

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
import { ref, onMounted, computed } from 'vue';
import { Download as DownloadIcon, Upload as UploadIcon, Trash2 as TrashIcon } from 'lucide-vue-next';

const storageSize = ref('0 KB');

const calculateStorageSize = () => {
  const history = localStorage.getItem('coffee_history') || '[]';
  const size = (new Blob([history]).size / 1024).toFixed(2);
  storageSize.value = `${size} KB`;
};

onMounted(calculateStorageSize);

const exportData = () => {
  const history = localStorage.getItem('coffee_history') || '[]';
  const blob = new Blob([history], { type: 'application/json' });
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
        const history = JSON.parse(localStorage.getItem('coffee_history') || '[]');
        // Simple merge by ID to avoid duplicates
        const existingIds = new Set(history.map(r => r.id));
        const newRecords = importedData.filter(r => !existingIds.has(r.id));
        
        const merged = [...newRecords, ...history];
        localStorage.setItem('coffee_history', JSON.stringify(merged));
        calculateStorageSize();
        alert(`Successfully imported ${newRecords.length} new records!`);
        location.reload(); // Refresh to update all views
      }
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
};

const clearHistory = () => {
  if (confirm('CRITICAL WARNING: This will PERMANENTLY DELETE all your coffee records. This action cannot be undone. Are you absolutely sure?')) {
    localStorage.removeItem('coffee_history');
    calculateStorageSize();
    alert('All records have been cleared.');
    location.reload();
  }
};
</script>
