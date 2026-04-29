<template>
  <div class="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
    <header class="sticky top-0 z-40 bg-[#f8f9fa]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-2xl">☕</span>
        <h1 class="text-xl font-black tracking-tight uppercase">Coffee Log</h1>
      </div>
      <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <UserIcon :size="20" class="text-gray-400" />
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-6 pt-2 pb-32">
      <Transition name="fade" mode="out-in">
        <component 
          :is="currentView" 
          v-bind="viewProps" 
          @record-saved="onRecordSaved"
          @edit-record="onEditRecord"
          @cancel-edit="onCancelEdit"
        />
      </Transition>
    </main>

    <!-- Navigation -->
    <BottomNav :modelValue="activeTab" @update:modelValue="onNavChange" />

    <!-- Initial Loading Screen -->
    <LoadingScreen @finished="appReady = true" />

    <!-- PWA Update Notification -->
    <div v-if="needRefresh" class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-4 z-50">
      <span class="text-sm font-bold">New version available!</span>
      <button @click="updateServiceWorker()" class="text-amber-400 font-black text-sm uppercase hover:text-amber-300 transition-colors">Update</button>
      <button @click="closePrompt" class="text-gray-400 hover:text-white transition-colors">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { User as UserIcon } from 'lucide-vue-next';
import BottomNav from './components/BottomNav.vue';
import HomeView from './components/HomeView.vue';
import AddView from './components/AddView.vue';
import HistoryView from './components/HistoryView.vue';
import SettingsView from './components/SettingsView.vue';
import SearchView from './components/SearchView.vue';
import LoadingScreen from './components/LoadingScreen.vue';

// App state
const appReady = ref(false);
const activeTab = ref('home');
const editingRecord = ref(null);

// PWA Logic
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW();

const closePrompt = () => {
  needRefresh.value = false;
};

const currentView = computed(() => {
  switch (activeTab.value) {
    case 'home': return HomeView;
    case 'add': return AddView;
    case 'history': return HistoryView;
    case 'search': return SearchView;
    case 'settings': return SettingsView;
    default: return HomeView;
  }
});

const viewProps = computed(() => {
  if (activeTab.value === 'add') return { initialData: editingRecord.value };
  return {};
});

const onRecordSaved = () => {
  activeTab.value = 'home';
  editingRecord.value = null;
};

const onEditRecord = (record) => {
  editingRecord.value = record;
  activeTab.value = 'add';
};

const onNavChange = (tab) => {
  if (tab === 'add') editingRecord.value = null;
  activeTab.value = tab;
};

const onCancelEdit = () => {
  editingRecord.value = null;
  activeTab.value = 'home';
};
</script>

<style>
#app { width: 100%; margin: 0; padding: 0; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
