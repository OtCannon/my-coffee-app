<template>
  <div class="space-y-6">
    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50 backdrop-blur-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-amber-600 rounded-full mr-3"></span>
        Basic Information
      </h2>

      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-center">
          <div class="min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1">Brew Date</label>
            <input
              ref="brewDateRef"
              v-model="formData.date"
              type="date"
              class="w-full text-center px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
              @keydown.enter.prevent="focusNext(storeRef)"
            >
          </div>

          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Store</label>
            <div class="relative group">
              <input
                ref="storeRef"
                v-model="formData.store"
                type="text"
                placeholder="Enter store name..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50 font-bold"
                @keydown.enter.prevent="focusNext(coffeeNameRef)"
                @focus="activeSuggestions = 'store'"
                @blur="clearSuggestions('store')"
              >
              <button v-if="formData.store" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" @click="formData.store = ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'store'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic" @click="selectOption('store', 'Unknown')">Unknown</div>
              <div v-for="store in filteredHistoryStores" :key="store" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0" @click="selectOption('store', store)">{{ store }}</div>
            </div>
          </div>

          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Coffee Name</label>
            <div class="relative group">
              <input
                ref="coffeeNameRef"
                v-model="formData.coffeeName"
                type="text"
                placeholder="e.g. Ethiopia Yirgacheffe G1..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
                @keydown.enter.prevent="focusNext(originRef)"
                @focus="activeSuggestions = 'coffeeName'"
                @blur="clearSuggestions('coffeeName')"
              >
              <button v-if="formData.coffeeName" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" @click="formData.coffeeName = ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'coffeeName'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic" @click="selectOption('coffeeName', 'Unknown')">Unknown</div>
              <div v-for="name in filteredHistoryCoffeeNames" :key="name" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0" @click="selectOption('coffeeName', name)">{{ name }}</div>
            </div>
          </div>

          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Origin</label>
            <div class="relative group">
              <input
                ref="originRef"
                v-model="formData.beanOrigin"
                type="text"
                placeholder="Type or select origin..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
                @keydown.enter.prevent="focusNext(estateRef)"
                @focus="activeSuggestions = 'origin'"
                @blur="clearSuggestions('origin')"
              >
              <button v-if="formData.beanOrigin" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" @click="formData.beanOrigin = ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'origin'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic" @click="selectOption('beanOrigin', 'Unknown')">Unknown</div>
              <div v-for="origin in filteredOrigins" :key="origin" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0" @click="selectOption('beanOrigin', origin)">{{ origin }}</div>
            </div>
          </div>

          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Farm / Estate</label>
            <div class="relative group">
              <input
                ref="estateRef"
                v-model="formData.beanEstate"
                type="text"
                placeholder="e.g. Hacienda Esmeralda"
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
                @keydown.enter.prevent="focusNext(processRef)"
                @focus="activeSuggestions = 'estate'"
                @blur="clearSuggestions('estate')"
              >
              <button v-if="formData.beanEstate" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" @click="formData.beanEstate = ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'estate'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic" @click="selectOption('beanEstate', 'Unknown')">Unknown</div>
              <div v-for="estate in filteredHistoryEstates" :key="estate" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0" @click="selectOption('beanEstate', estate)">{{ estate }}</div>
            </div>
          </div>

          <div class="min-w-0 relative">
            <label class="block text-sm font-bold text-gray-700 mb-1">Process</label>
            <div class="relative group">
              <input
                ref="processRef"
                v-model="formData.beanProcess"
                type="text"
                placeholder="Type or select process..."
                class="w-full text-center px-4 py-3 pr-10 rounded-2xl border-2 border-gray-100 focus:border-amber-500 focus:ring-0 transition-all bg-gray-50/50"
                @keydown.enter.prevent="processRef?.blur?.()"
                @focus="activeSuggestions = 'process'"
                @blur="clearSuggestions('process')"
              >
              <button v-if="formData.beanProcess" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" @click="formData.beanProcess = ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <div v-if="activeSuggestions === 'process'" class="absolute z-50 w-full mt-1 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
              <div class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-amber-600 border-b border-gray-50 italic" @click="selectOption('beanProcess', 'Unknown')">Unknown</div>
              <div v-for="process in filteredProcesses" :key="process" class="px-4 py-3 hover:bg-amber-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0" @click="selectOption('beanProcess', process)">{{ process }}</div>
            </div>
          </div>

          <div class="min-w-0">
            <label class="block text-sm font-bold text-gray-700 mb-1">Roast</label>
            <div class="flex items-center justify-between bg-gray-50/50 p-2 rounded-2xl border-2 border-gray-100 h-[52px]">
              <div class="flex space-x-1 ml-1">
                <button
                  v-for="level in 5"
                  :key="level"
                  type="button"
                  class="transition-transform active:scale-90"
                  @click="formData.roastLevel = level"
                >
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32.5 12.5C28.5 7.5 21.5 6.5 15.5 9.5C9.5 12.5 6.5 19.5 8.5 26.5C10.5 33.5 18.5 35.5 24.5 32.5C30.5 29.5 36.5 17.5 32.5 12.5Z" :stroke="formData.roastLevel === level ? '#451a03' : '#d1d5db'" :fill="formData.roastLevel === level ? '#78350f' : 'transparent'" stroke-width="3" />
                    <path d="M14 13C16 18 24 22 26 27" :stroke="formData.roastLevel === level ? '#451a03' : '#d1d5db'" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
                  </svg>
                </button>
                <button type="button" class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all" :class="formData.roastLevel === 0 ? 'bg-gray-400 border-gray-500 text-white' : 'border-gray-200 text-gray-300'" @click="formData.roastLevel = 0">?</button>
              </div>
              <span class="text-[10px] font-black text-amber-700 mr-2 uppercase w-12 text-right leading-tight">{{ roastLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="w-2 h-6 bg-rose-500 rounded-full mr-3"></span>
        Sensory Profile
      </h2>

      <div class="space-y-8">
        <div v-for="attr in sensoryAttributes" :key="attr.key">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-bold text-gray-700 ml-1">{{ attr.label }}</label>
            <span class="text-lg font-black text-amber-600">{{ formData.scores[attr.key] }}</span>
          </div>
          <input
            v-model.number="formData.scores[attr.key]"
            type="range"
            min="1"
            max="5"
            step="0.5"
            class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
          >
          <div class="flex justify-between text-[10px] font-bold text-gray-300 mt-2 px-1">
            <span>{{ attr.min }}</span>
            <span>{{ attr.max }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-xl rounded-3xl p-6 border border-gray-100/50">
      <div class="flex flex-col items-center space-y-4">
        <div class="flex space-x-2">
          <button v-for="star in 5" :key="star" type="button" class="transition-transform active:scale-90" @click="formData.score = star">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" :class="formData.score >= star ? 'text-amber-400' : 'text-gray-200'" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
        <div class="text-sm font-black text-amber-700 uppercase tracking-widest">
          Rating: {{ formData.score }} / 5
        </div>
      </div>
    </div>

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
          <div v-for="flavor in formData.selectedFlavors" :key="flavor.name" class="bg-purple-50/50 px-4 py-2 rounded-2xl border border-purple-100/50 flex items-center space-x-2 group">
            <span class="font-bold text-purple-700 text-sm">{{ flavor.name }}</span>
            <button class="text-purple-300 hover:text-rose-500 transition-colors" @click="removeFlavor(flavor.name)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pb-24 space-y-3">
      <button
        :disabled="!isFormValid"
        class="w-full py-4 bg-amber-700 text-white font-black rounded-2xl shadow-lg hover:bg-amber-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        @click="saveRecord"
      >
        <span>{{ initialData ? 'Update Record' : 'Save New Entry' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <button v-if="initialData" class="w-full py-4 bg-white text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all" @click="emit('cancel-edit')">
        Cancel Editing
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import FlavorDrillDown from './FlavorDrillDown.vue';
import beansData from '../data/beans.json';
import * as recordStore from '../utils/recordStore.js';
import {
  DRAFT_STORAGE_KEY,
  cloneCoffeeRecord,
  createDefaultCoffeeRecord,
  normalizeCoffeeRecord
} from '../utils/coffeeRecord.js';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['record-saved', 'cancel-edit']);

const brewDateRef = ref(null);
const storeRef = ref(null);
const coffeeNameRef = ref(null);
const originRef = ref(null);
const estateRef = ref(null);
const processRef = ref(null);

const formData = reactive(createDefaultCoffeeRecord());
const activeSuggestions = ref(null);
const coffeeHistory = ref([]);

const roastLabels = ['Light', 'M-Light', 'Med', 'M-Dark', 'Dark'];
const sensoryAttributes = [
  { key: 'acidity', label: 'Acidity', min: 'Low', max: 'High' },
  { key: 'bitterness', label: 'Bitterness', min: 'Low', max: 'High' },
  { key: 'sweetness', label: 'Sweetness', min: 'Low', max: 'High' },
  { key: 'body', label: 'Body', min: 'Light', max: 'Heavy' }
];

const isFormValid = computed(() => Boolean(formData.coffeeName && formData.selectedFlavors.length > 0));

const roastLabel = computed(() => {
  if (formData.roastLevel === 0) return 'Unk';
  return roastLabels[formData.roastLevel - 1];
});

const filteredOrigins = computed(() => {
  const query = formData.beanOrigin.toLowerCase();
  return beansData.origins.filter((origin) => origin.toLowerCase().includes(query));
});

const filteredProcesses = computed(() => {
  const query = formData.beanProcess.toLowerCase();
  return beansData.processes.filter((process) => process.toLowerCase().includes(query));
});

const filteredHistoryStores = computed(() => {
  const stores = [...new Set(coffeeHistory.value.map((record) => record.store))].filter(Boolean);
  const query = formData.store.toLowerCase();
  return stores.filter((store) => store.toLowerCase().includes(query));
});

const filteredHistoryCoffeeNames = computed(() => {
  if (!formData.store) return [];

  const names = [...new Set(
    coffeeHistory.value
      .filter((record) => record.store.toLowerCase() === formData.store.toLowerCase())
      .map((record) => record.coffeeName)
  )].filter(Boolean);

  const query = formData.coffeeName.toLowerCase();
  return names.filter((name) => name.toLowerCase().includes(query));
});

const filteredHistoryEstates = computed(() => {
  const estates = [...new Set(coffeeHistory.value.map((record) => record.beanEstate))].filter(Boolean);
  const query = formData.beanEstate.toLowerCase();
  return estates.filter((estate) => estate.toLowerCase().includes(query));
});

const focusNext = (nextRef) => {
  nextRef?.value?.focus();
};

const clearSuggestions = (field) => {
  setTimeout(() => {
    if (activeSuggestions.value === field) activeSuggestions.value = null;
  }, 200);
};

const resetForm = () => {
  Object.assign(formData, createDefaultCoffeeRecord());
};

const hydrateForm = () => {
  if (props.initialData) {
    Object.assign(formData, cloneCoffeeRecord(props.initialData));
    return;
  }

  const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (draft) {
    Object.assign(formData, JSON.parse(draft));
  }
};

const loadHistory = async () => {
  coffeeHistory.value = await recordStore.getAllRecords();
};

const selectOption = (field, value) => {
  formData[field] = value;
  activeSuggestions.value = null;
};

const addFlavor = (flavor) => {
  if (!formData.selectedFlavors.some((entry) => entry.name === flavor.name)) {
    formData.selectedFlavors.push({
      id: flavor.id,
      name: flavor.name
    });
  }
};

const removeFlavor = (name) => {
  formData.selectedFlavors = formData.selectedFlavors.filter((flavor) => flavor.name !== name);
};

const saveRecord = async () => {
  const now = new Date().toISOString();
  const cleanData = normalizeCoffeeRecord(formData);

  if (props.initialData) {
    await recordStore.saveRecord({
      ...cleanData,
      id: props.initialData.id,
      timestamp: props.initialData.timestamp,
      updatedAt: now,
      isActive: cleanData.isActive ?? true
    });
  } else {
    await recordStore.saveRecord({
      ...cleanData,
      id: Date.now().toString(),
      timestamp: now,
      updatedAt: now,
      isActive: true
    });

    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }

  resetForm();
  emit('record-saved');
};

onMounted(() => {
  hydrateForm();
  loadHistory();
});

watch(formData, (newValue) => {
  if (!props.initialData) {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newValue));
  }
}, { deep: true });
</script>
