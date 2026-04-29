<template>
  <div class="space-y-6 pb-24">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-black text-gray-700">Taste History!</h2>
      <div class="flex items-center space-x-2">
        <select v-model="sortBy" class="bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-600 rounded-xl px-2 py-1 outline-none focus:border-amber-500 transition-colors">
          <option value="date">Brew Date</option>
          <option value="updatedAt">Update Time</option>
          <option value="timestamp">Establish Time</option>
          <option value="score">Score</option>
        </select>
        <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          {{ records.length }} Sessions
        </span>
      </div>
    </div>

    <div v-if="records.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <CoffeeIcon class="text-gray-300" :size="40" />
      </div>
      <p class="text-gray-400 font-medium text-center px-6">Your coffee journey starts here.<br>Click the "+" to record your first brew.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="record in sortedRecords" 
        :key="record.id"
        class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1 pr-4">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">{{ record.store || 'Home Brew' }}</span>
              <span class="text-gray-300">/</span>
              <!-- Roast Level Indicator -->
              <div class="flex items-center space-x-1">
                <svg width="10" height="10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M32.5 12.5C28.5 7.5 21.5 6.5 15.5 9.5C9.5 12.5 6.5 19.5 8.5 26.5C10.5 33.5 18.5 35.5 24.5 32.5C30.5 29.5 36.5 17.5 32.5 12.5Z" 
                    :fill="record.roastLevel ? ['#d4d4d8', '#a8a29e', '#78350f', '#451a03', '#1a0a02'][record.roastLevel - 1] : '#e5e7eb'"
                  />
                </svg>
                <span class="text-[9px] font-bold text-gray-500 uppercase">{{ record.roastLevel ? ['Light', 'M-Light', 'Med', 'M-Dark', 'Dark'][record.roastLevel - 1] : 'Unk' }}</span>
              </div>
              <span v-if="record.roastLevel" class="text-gray-300">/</span>
              <span class="text-[10px] font-bold text-gray-400">{{ formatDate(record.date) }}</span>
            </div>
            <h3 class="text-xl font-black text-gray-900 leading-tight mb-2">{{ record.coffeeName }}</h3>
            
            <div class="flex flex-wrap gap-2 items-center">
              <span class="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100 flex items-center">
                <MapPinIcon :size="10" class="mr-1" />
                {{ record.beanOrigin }}
              </span>
              <span v-if="record.beanEstate" class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {{ record.beanEstate }}
              </span>
              <span class="bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-100">
                {{ record.beanProcess }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex text-amber-400">
              <svg 
                v-for="star in 5" 
                :key="star"
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4" 
                :class="record.score >= star ? 'text-amber-400' : 'text-gray-200'"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-[10px] font-black text-gray-400 mt-1 uppercase">{{ record.score }}/5</span>
          </div>
        </div>

        <!-- Sensory Profile -->
        <div class="bg-gray-50/50 rounded-2xl p-4 mb-4 border border-gray-100/50">
          <div class="grid grid-cols-4 gap-2">
            <div v-for="(val, key) in record.scores" :key="key" class="text-center">
              <div class="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1 truncate">{{ key }}</div>
              <div class="text-xs font-black text-gray-800">{{ val }}</div>
            </div>
          </div>
        </div>

        <!-- Flavors -->
        <div class="flex flex-wrap gap-1.5">
          <span 
            v-for="flavor in record.selectedFlavors" 
            :key="flavor.name"
            class="text-[10px] font-bold bg-white text-purple-600 px-2.5 py-1 rounded-xl border border-purple-100 shadow-sm flex items-center"
          >
            <span class="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5 opacity-60"></span>
            {{ flavor.name }}
          </span>
        </div>

        <!-- Actions -->
        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-end space-x-6 transition-opacity">
          <button @click="emit('edit-record', record)" class="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center space-x-1">
            <EditIcon :size="14" />
            <span>Edit</span>
          </button>
          <button @click="deleteRecord(record.id)" class="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center space-x-1">
            <TrashIcon :size="14" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Coffee as CoffeeIcon, Trash2 as TrashIcon, Edit3 as EditIcon, MapPin as MapPinIcon } from 'lucide-vue-next';
import * as db from '../utils/db.js';

const emit = defineEmits(['edit-record']);
const records = ref([]);
const sortBy = ref('date');

const sortedRecords = computed(() => {
  return [...records.value].sort((a, b) => {
    if (sortBy.value === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy.value === 'updatedAt') return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    if (sortBy.value === 'timestamp') return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    if (sortBy.value === 'score') return parseFloat(b.score) - parseFloat(a.score);
    return 0;
  });
});

const loadRecords = async () => {
  const history = await db.getAllRecords();
  records.value = history.filter(r => r.isActive !== false);
};

const deleteRecord = async (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    const history = await db.getAllRecords();
    const record = history.find(r => r.id === id);
    if (record) {
      record.isActive = false;
      record.updatedAt = new Date().toISOString();
      await db.saveRecord(record);
      await loadRecords();
    }
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

onMounted(loadRecords);
</script>
