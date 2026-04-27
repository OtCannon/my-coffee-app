<template>
  <div class="space-y-6 pb-24">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-black text-gray-900">Brew History</h2>
      <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {{ records.length }} Sessions
      </span>
    </div>

    <div v-if="records.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <CoffeeIcon class="text-gray-300" :size="40" />
      </div>
      <p class="text-gray-400 font-medium text-center px-6">Your coffee journey starts here.<br>Click the "+" to record your first brew.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="record in records" 
        :key="record.id"
        class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1 pr-4">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">{{ record.store || 'Home Brew' }}</span>
              <span class="text-gray-300">/</span>
              <span class="text-[10px] font-bold text-gray-400">{{ formatDate(record.date) }}</span>
            </div>
            <h3 class="text-xl font-black text-gray-900 leading-tight mb-2">{{ record.coffeeName }}</h3>
            
            <div class="flex flex-wrap gap-2 items-center">
              <span class="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100 flex items-center">
                <MapPinIcon :size="10" class="mr-1" />
                {{ record.beanOrigin }}
              </span>
              <span class="bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-100">
                {{ record.beanProcess }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="bg-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-gray-200">
              {{ record.score }}
            </div>
          </div>
        </div>

        <!-- Sensory Profile -->
        <div class="bg-gray-50/50 rounded-2xl p-4 mb-4 border border-gray-100/50">
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(val, key) in record.scores" :key="key" class="text-center">
              <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">{{ key }}</div>
              <div class="text-sm font-black text-gray-800">{{ val }}</div>
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
            <span class="ml-1.5 px-1.5 py-0.5 bg-purple-50 rounded-md text-[8px] text-purple-400">{{ flavor.intensity }}</span>
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
import { ref, onMounted } from 'vue';
import { Coffee as CoffeeIcon, Trash2 as TrashIcon, Edit3 as EditIcon, MapPin as MapPinIcon } from 'lucide-vue-next';

const emit = defineEmits(['edit-record']);
const records = ref([]);

const loadRecords = () => {
  records.value = JSON.parse(localStorage.getItem('coffee_history') || '[]');
};

const deleteRecord = (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    const history = JSON.parse(localStorage.getItem('coffee_history') || '[]');
    const filtered = history.filter(r => r.id !== id);
    localStorage.setItem('coffee_history', JSON.stringify(filtered));
    loadRecords();
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
