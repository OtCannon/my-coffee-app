<template>
  <div class="space-y-6">
    <!-- Basic Info Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50 backdrop-blur-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-amber-600 rounded-full mr-3"></span>
        Basic Information
      </h2>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-center">
          <!-- Brew Date -->
          <div class="min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1">Brew Date</label>
            <input 
              type="date" 
              v-model="formData.date"
              ref="brewDateRef"
              @keydown.enter.prevent="focusNext(storeRef)"
              class="w-full text-center px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
            >
          </div>

          <!-- Store -->
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Store (店家)</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="formData.store"
                ref="storeRef"
                @keydown.enter.prevent="focusNext(coffeeNameRef)"
                @focus="activeSuggestions = 'store'"
                @blur="setTimeout(() => { if (activeSuggestions === 'store') activeSuggestions = null }, 200)"
                placeholder="Enter store name..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50 font-bold"
              >
              <button v-if="formData.store" @click="formData.store = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'store'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div @click="selectOption('store', 'Unknown')" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic">Unknown</div>
              <div v-for="s in filteredHistoryStores" :key="s" @click="selectOption('store', s)" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{{ s }}</div>
            </div>
          </div>

          <!-- Coffee Name -->
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Coffee Name (豆名)</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="formData.coffeeName"
                ref="coffeeNameRef"
                @keydown.enter.prevent="focusNext(originRef)"
                @focus="activeSuggestions = 'coffeeName'"
                @blur="setTimeout(() => { if (activeSuggestions === 'coffeeName') activeSuggestions = null }, 200)"
                placeholder="e.g. Ethiopia Yirgacheffe G1..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
              >
              <button v-if="formData.coffeeName" @click="formData.coffeeName = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'coffeeName'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div @click="selectOption('coffeeName', 'Unknown')" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic">Unknown</div>
              <div v-for="cn in filteredHistoryCoffeeNames" :key="cn" @click="selectOption('coffeeName', cn)" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{{ cn }}</div>
            </div>
          </div>

          <!-- Origin -->
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Origin (產地)</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="formData.beanOrigin"
                ref="originRef"
                @keydown.enter.prevent="focusNext(estateRef)"
                @focus="activeSuggestions = 'origin'"
                @blur="setTimeout(() => { if (activeSuggestions === 'origin') activeSuggestions = null }, 200)"
                placeholder="Type or select origin..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
              >
              <button v-if="formData.beanOrigin" @click="formData.beanOrigin = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'origin'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div @click="selectOption('beanOrigin', 'Unknown')" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic">Unknown</div>
              <div v-for="o in filteredOrigins" :key="o" @click="selectOption('beanOrigin', o)" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{{ o }}</div>
            </div>
          </div>

          <!-- Farm / Estate -->
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Farm / Estate (莊園)</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="formData.beanEstate"
                ref="estateRef"
                @keydown.enter.prevent="focusNext(processRef)"
                @focus="activeSuggestions = 'estate'"
                @blur="setTimeout(() => { if (activeSuggestions === 'estate') activeSuggestions = null }, 200)"
                placeholder="e.g. Hacienda Esmeralda"
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
              >
              <button v-if="formData.beanEstate" @click="formData.beanEstate = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'estate'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div @click="selectOption('beanEstate', 'Unknown')" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic">Unknown</div>
              <div v-for="e in filteredHistoryEstates" :key="e" @click="selectOption('beanEstate', e)" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{{ e }}</div>
            </div>
          </div>

          <!-- Process -->
          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Process (處理方式)</label>
            <div class="relative group">
              <input 
                type="text" 
                v-model="formData.beanProcess"
                ref="processRef"
                @keydown.enter.prevent="processRef.blur()"
                @focus="activeSuggestions = 'process'"
                @blur="setTimeout(() => { if (activeSuggestions === 'process') activeSuggestions = null }, 200)"
                placeholder="Type or select process..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
              >
              <button v-if="formData.beanProcess" @click="formData.beanProcess = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'process'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div @click="selectOption('beanProcess', 'Unknown')" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic">Unknown</div>
              <div v-for="p in filteredProcesses" :key="p" @click="selectOption('beanProcess', p)" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{{ p }}</div>
            </div>
          </div>

          <!-- Roast Level Selector -->
          <div class="min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1">Roast (烘焙度)</label>
            <div class="flex items-center justify-between bg-gray-50/50 p-2 rounded-2xl border-2 border-gray-100 h-[52px]">
              <div class="flex space-x-1 ml-1">
                <button 
                  v-for="level in 5" 
                  :key="level"
                  @click="formData.roastLevel = level"
                  type="button"
                  class="transition-transform active:scale-90"
                >
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M32.5 12.5C28.5 7.5 21.5 6.5 15.5 9.5C9.5 12.5 6.5 19.5 8.5 26.5C10.5 33.5 18.5 35.5 24.5 32.5C30.5 29.5 36.5 17.5 32.5 12.5Z" 
                      :stroke="formData.roastLevel === level ? '#451a03' : '#d1d5db'"
                      :fill="formData.roastLevel === level ? '#78350f' : 'transparent'"
                      stroke-width="3"
                    />
                    <path d="M14 13C16 18 24 22 26 27" :stroke="formData.roastLevel === level ? '#451a03' : '#d1d5db'" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
                  </svg>
                </button>
                <button @click="formData.roastLevel = 0" type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all" :class="formData.roastLevel === 0 ? 'bg-gray-400 border-gray-500 text-white' : 'border-gray-200 text-gray-300'">?</button>
              </div>
              <span class="text-[10px] font-black text-amber-700 mr-2 uppercase w-12 text-right leading-tight">{{ formData.roastLevel === 0 ? 'Unk' : ['Light', 'M-Light', 'Med', 'M-Dark', 'Dark'][formData.roastLevel - 1] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Intensity Slider Card -->
    <IntensitySlider v-model="formData.intensity" />

    <!-- Sensory Scores Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-rose-500 rounded-full mr-3"></span>
        Sensory Profile
      </h2>
      
      <div class="space-y-8">
        <div v-for="attr in [
          { key: 'acidity', label: '酸質 (Acidity)', min: '低酸/醇厚', max: '極酸/明亮' },
          { key: 'bitterness', label: '苦韻 (Bitterness)', min: '無苦/清甜', max: '重苦/焦香' },
          { key: 'sweetness', label: '甜感 (Sweetness)', min: '單薄', max: '極甜/回甘強' },
          { key: 'body', label: '口感 (Body)', min: '像水/清爽', max: '像牛奶/濃稠' }
        ]" :key="attr.key">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-bold text-gray-700 ml-1">{{ attr.label }}</label>
            <span class="text-lg font-black text-amber-600">{{ formData.scores[attr.key] }}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            step="0.5" 
            v-model.number="formData.scores[attr.key]"
            class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          >
          <div class="flex justify-between text-[10px] font-bold text-gray-300 mt-2 px-1">
            <span>{{ attr.min }}</span>
            <span>{{ attr.max }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Star Rating Card -->
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <div class="flex flex-col items-center space-y-4">
        <div class="flex space-x-2">
          <button 
            v-for="star in 5" 
            :key="star"
            @click="formData.score = star"
            type="button"
            class="transition-transform active:scale-90"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-10 w-10" 
              :class="formData.score >= star ? 'text-amber-400' : 'text-gray-200'"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
        <div class="text-sm font-black text-amber-700 uppercase tracking-widest">
          Rating: {{ formData.score }} / 5
        </div>
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
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Selected Flavors</h3>
        <div v-if="formData.selectedFlavors.length === 0" class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
          <p class="text-gray-400 text-sm">No flavors selected yet</p>
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <div 
            v-for="flavor in formData.selectedFlavors" 
            :key="flavor.name"
            class="bg-purple-50/50 px-4 py-2 rounded-2xl border border-purple-100/50 flex items-center space-x-2 group"
          >
            <span class="font-bold text-purple-700 text-sm">
              {{ flavor.name }}
            </span>
            <button @click="removeFlavor(flavor.name)" class="text-purple-300 hover:text-rose-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
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
import IntensitySlider from './IntensitySlider.vue';
import beansData from '../data/beans.json';
import * as db from '../utils/db.js';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['record-saved', 'cancel-edit']);

// Input Refs for focus navigation
const brewDateRef = ref(null);
const storeRef = ref(null);
const coffeeNameRef = ref(null);
const originRef = ref(null);
const estateRef = ref(null);
const processRef = ref(null);

const focusNext = (nextRef) => {
  if (nextRef) {
    nextRef.focus();
  }
};

const initialFormData = {
  date: new Date().toISOString().substr(0, 10),
  store: '',
  coffeeName: '',
  beanOrigin: '',
  beanEstate: '',
  beanProcess: '',
  roastLevel: 3,
  intensity: 3,
  scores: {
    acidity: 3,
    bitterness: 3,
    sweetness: 3,
    body: 3
  },
  selectedFlavors: [],
  score: 5,
  isActive: true,
  updatedAt: new Date().toISOString()
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
  return formData.coffeeName && formData.selectedFlavors.length > 0;
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
  activeSuggestions.value = null;
};

// Historical Suggestions
const coffeeHistory = ref([]);
const loadHistory = async () => {
  coffeeHistory.value = await db.getAllRecords();
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

const filteredHistoryEstates = computed(() => {
  const estates = [...new Set(coffeeHistory.value.map(r => r.beanEstate))].filter(Boolean);
  const query = formData.beanEstate.toLowerCase();
  return estates.filter(e => e.toLowerCase().includes(query));
});

const addFlavor = (flavor) => {
  if (!formData.selectedFlavors.some(f => f.name === flavor.name)) {
    formData.selectedFlavors.push({ 
      id: flavor.id,
      name: flavor.name
    });
  }
};

const removeFlavor = (name) => {
  formData.selectedFlavors = formData.selectedFlavors.filter(f => f.name !== name);
};

const saveRecord = async () => {
  const history = await db.getAllRecords();
  const now = new Date().toISOString();

  // 1. 準備要儲存的基礎資料 (從表單複製)
  const cleanData = JSON.parse(JSON.stringify(formData));
  
  // 處理空值
  if (!cleanData.store) cleanData.store = 'Unknown';
  if (!cleanData.beanOrigin) cleanData.beanOrigin = 'Unknown';
  if (!cleanData.beanEstate) cleanData.beanEstate = 'Unknown';
  if (!cleanData.beanProcess) cleanData.beanProcess = 'Unknown';
  if (cleanData.roastLevel === undefined || cleanData.roastLevel === null) cleanData.roastLevel = 0;

  if (props.initialData) {
    // 【編輯模式】：精準定位並更新那一筆
    const record = history.find(r => r.id === props.initialData.id);
    if (record) {
      const updatedRecord = {
        ...cleanData,
        id: props.initialData.id,           // 保持原始 ID
        timestamp: props.initialData.timestamp, // 保持原始建立時間
        updatedAt: now,                     // 【關鍵】強制更新這次的編輯時間
        isActive: cleanData.isActive !== undefined ? cleanData.isActive : true
      };
      
      await db.saveRecord(updatedRecord);
    }
  } else {
    // 【新增模式】：建立全新的紀錄
    const newRecord = {
      ...cleanData,
      id: Date.now().toString(),
      timestamp: now,
      updatedAt: now,
      isActive: true
    };
    await db.saveRecord(newRecord);
    
    // 清除草稿
    localStorage.removeItem('coffee_draft');
  }
  
  // Reset form
  Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
  emit('record-saved');
};
</script>
