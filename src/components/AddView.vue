<template>
  <div class="space-y-6">
    <!-- Basic Info Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50 backdrop-blur-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-amber-600 rounded-full mr-3"></span>
        Basic Information
      </h2>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Brew Date</label>
            <input 
              type="date" 
              v-model="formData.date"
              class="w-full max-w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
            >
          </div>
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Store (店家)</label>
            <input 
              type="text" 
              v-model="formData.store"
              @focus="activeSuggestions = 'store'"
              @blur="setTimeout(() => { if (activeSuggestions === 'store') activeSuggestions = null }, 200)"
              placeholder="Enter store name..."
              class="w-full max-w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
            >
            <div 
              v-if="activeSuggestions === 'store' && filteredHistoryStores.length > 0" 
              class="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto"
            >
              <div 
                v-for="s in filteredHistoryStores" 
                :key="s"
                @click="selectOption('store', s)"
                class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 transition-colors border-b border-gray-50 last:border-0"
              >
                {{ s }}
              </div>
            </div>
          </div>
        </div>

        <div class="min-w-0 relative">
          <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Coffee Name (豆名)</label>
          <input 
            type="text" 
            v-model="formData.coffeeName"
            @focus="activeSuggestions = 'coffeeName'"
            @blur="setTimeout(() => { if (activeSuggestions === 'coffeeName') activeSuggestions = null }, 200)"
            placeholder="e.g. Ethiopia Yirgacheffe G1..."
            class="w-full max-w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
          >
          <div 
            v-if="activeSuggestions === 'coffeeName' && filteredHistoryCoffeeNames.length > 0" 
            class="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto"
          >
            <div 
              v-for="cn in filteredHistoryCoffeeNames" 
              :key="cn"
              @click="selectOption('coffeeName', cn)"
              class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 transition-colors border-b border-gray-50 last:border-0"
            >
              {{ cn }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Origin Autocomplete -->
          <div class="relative min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Origin (產地)</label>
            <input 
              type="text" 
              v-model="formData.beanOrigin"
              @focus="activeSuggestions = 'origin'"
              @blur="setTimeout(() => { if (activeSuggestions === 'origin') activeSuggestions = null }, 200)"
              placeholder="Type or select origin..."
              class="w-full max-w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
            >
            <div 
              v-if="activeSuggestions === 'origin' && filteredOrigins.length > 0" 
              class="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto"
            >
              <div 
                v-for="o in filteredOrigins" 
                :key="o"
                @click="selectOption('beanOrigin', o)"
                class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 transition-colors border-b border-gray-50 last:border-0"
              >
                {{ o }}
              </div>
            </div>
          </div>

          <!-- Process Autocomplete -->
          <div class="relative min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1 ml-1">Process (處理方式)</label>
            <input 
              type="text" 
              v-model="formData.beanProcess"
              @focus="activeSuggestions = 'process'"
              @blur="setTimeout(() => { if (activeSuggestions === 'process') activeSuggestions = null }, 200)"
              placeholder="Type or select process..."
              class="w-full max-w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
            >
            <div 
              v-if="activeSuggestions === 'process' && filteredProcesses.length > 0" 
              class="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto"
            >
              <div 
                v-for="p in filteredProcesses" 
                :key="p"
                @click="selectOption('beanProcess', p)"
                class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 transition-colors border-b border-gray-50 last:border-0"
              >
                {{ p }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sensory Scores Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-rose-500 rounded-full mr-3"></span>
        Sensory Profile (0-5)
      </h2>
      
      <div class="space-y-6">
        <div v-for="score in ['acidity', 'bitterness', 'body']" :key="score">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-bold text-gray-700 capitalize ml-1">{{ score }}</label>
            <span class="text-lg font-black text-amber-600">{{ formData.scores[score] }}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5" 
            v-model.number="formData.scores[score]"
            class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          >
        </div>
      </div>
    </div>

    <!-- Overall Score -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-amber-500 rounded-full mr-3"></span>
        Overall Score
      </h2>
      <div class="flex justify-between items-center mb-2">
        <label class="text-sm font-bold text-gray-700 ml-1">Personal Rating</label>
        <span class="text-2xl font-black text-amber-600">{{ formData.score }}</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="10" 
        step="0.5" 
        v-model.number="formData.score"
        class="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
      >
      <div class="flex justify-between text-[10px] font-bold text-gray-300 mt-2 px-1">
        <span>0 (Poor)</span>
        <span>5 (Average)</span>
        <span>10 (Excellent)</span>
      </div>
    </div>

    <!-- Flavor Selection Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50 flex flex-col">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-purple-600 rounded-full mr-3"></span>
        Flavor Discovery
      </h2>
      
      <FlavorDrillDown @flavor-selected="addFlavor" />

      <div class="mt-8">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Selected Flavors & Intensity (1-15)</h3>
        <div v-if="formData.selectedFlavors.length === 0" class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
          <p class="text-gray-400 text-sm">No flavors selected yet</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="flavor in formData.selectedFlavors" 
            :key="flavor.name"
            class="bg-purple-50/50 p-3 rounded-xl border border-purple-100/50 group"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold text-purple-700 flex items-center text-sm">
                <span class="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                {{ flavor.name }}
              </span>
              <button @click="removeFlavor(flavor.name)" class="text-purple-300 hover:text-rose-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <div class="flex items-center space-x-3">
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="0.5" 
                v-model.number="flavor.intensity"
                class="flex-1 h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
              >
              <span class="text-sm font-black text-purple-600 w-6 text-right">{{ flavor.intensity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit & Cancel Buttons -->
    <div class="pb-24 space-y-3">
      <button 
        @click="saveRecord"
        :disabled="!isFormValid"
        class="w-full py-4 bg-amber-700 text-white font-black rounded-2xl shadow-lg hover:bg-amber-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <span>{{ initialData ? 'Update Record' : 'Save New Entry' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <button 
        v-if="initialData"
        @click="emit('cancel-edit')"
        class="w-full py-4 bg-white text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all"
      >
        Cancel Editing
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import FlavorDrillDown from './FlavorDrillDown.vue';
import beansData from '../data/beans.json';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['record-saved', 'cancel-edit']);

const initialFormData = {
  date: new Date().toISOString().substr(0, 10),
  store: '',
  coffeeName: '',
  beanOrigin: '',
  beanProcess: '',
  scores: {
    acidity: 2.5,
    bitterness: 2.5,
    body: 2.5
  },
  selectedFlavors: [],
  score: 8.0
};

const formData = reactive({ ...initialFormData });

// Load draft or initialData on mount
onMounted(() => {
  if (props.initialData) {
    Object.assign(formData, JSON.parse(JSON.stringify(props.initialData)));
  } else {
    const draft = localStorage.getItem('coffee_draft');
    if (draft) {
      Object.assign(formData, JSON.parse(draft));
    }
  }
});

// Auto-save draft on changes (only if not editing)
watch(formData, (newVal) => {
  if (!props.initialData) {
    localStorage.setItem('coffee_draft', JSON.stringify(newVal));
  }
}, { deep: true });

const isFormValid = computed(() => {
  return formData.coffeeName && formData.beanOrigin && formData.beanProcess && formData.selectedFlavors.length > 0;
});

// Autocomplete Logic
const activeSuggestions = ref(null);

const filteredOrigins = computed(() => {
  const query = formData.beanOrigin.toLowerCase();
  return beansData.origins.filter(o => o.toLowerCase().includes(query));
});

const filteredProcesses = computed(() => {
  const query = formData.beanProcess.toLowerCase();
  return beansData.processes.filter(p => p.toLowerCase().includes(query));
});

const selectOption = (field, value) => {
  formData[field] = value;
  
  // Auto-fill logic for Coffee Name
  if (field === 'coffeeName' && formData.store) {
    const historicalMatch = coffeeHistory.value.find(r => 
      r.store.toLowerCase() === formData.store.toLowerCase() && 
      r.coffeeName.toLowerCase() === value.toLowerCase()
    );
    if (historicalMatch) {
      if (!formData.beanOrigin) formData.beanOrigin = historicalMatch.beanOrigin;
      if (!formData.beanProcess) formData.beanProcess = historicalMatch.beanProcess;
    }
  }
  
  activeSuggestions.value = null;
};

// Historical Suggestions
const coffeeHistory = ref([]);
const loadHistory = () => {
  coffeeHistory.value = JSON.parse(localStorage.getItem('coffee_history') || '[]');
};

onMounted(loadHistory);

const filteredHistoryStores = computed(() => {
  const stores = [...new Set(coffeeHistory.value.map(r => r.store))].filter(Boolean);
  const query = formData.store.toLowerCase();
  return stores.filter(s => s.toLowerCase().includes(query));
});

const filteredHistoryCoffeeNames = computed(() => {
  if (!formData.store) return [];
  const names = [...new Set(
    coffeeHistory.value
      .filter(r => r.store.toLowerCase() === formData.store.toLowerCase())
      .map(r => r.coffeeName)
  )].filter(Boolean);
  const query = formData.coffeeName.toLowerCase();
  return names.filter(n => n.toLowerCase().includes(query));
});

const addFlavor = (flavor) => {
  if (!formData.selectedFlavors.some(f => f.name === flavor.name)) {
    formData.selectedFlavors.push({ 
      name: flavor.name,
      intensity: 7.5 // Default middle of 1-15
    });
  }
};

const removeFlavor = (name) => {
  formData.selectedFlavors = formData.selectedFlavors.filter(f => f.name !== name);
};

const saveRecord = () => {
  if (!isFormValid.value) return;
  
  const history = JSON.parse(localStorage.getItem('coffee_history') || '[]');
  
  if (props.initialData) {
    // Update existing
    const index = history.findIndex(r => r.id === props.initialData.id);
    if (index !== -1) {
      history[index] = {
        ...JSON.parse(JSON.stringify(formData)),
        id: props.initialData.id,
        timestamp: props.initialData.timestamp,
        updatedAt: new Date().toISOString()
      };
    }
    localStorage.setItem('coffee_history', JSON.stringify(history));
    alert('Record updated!');
  } else {
    // Create new
    const record = {
      ...JSON.parse(JSON.stringify(formData)),
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    history.unshift(record);
    localStorage.setItem('coffee_history', JSON.stringify(history));
    
    // Clear draft
    localStorage.removeItem('coffee_draft');
    alert('Record saved to local history!');
  }
  
  // Reset form
  Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
  emit('record-saved');
};
</script>
