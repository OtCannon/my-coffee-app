<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
    <div class="max-w-md mx-auto relative pointer-events-auto">
      <!-- Nav Container -->
      <div class="bg-white/90 backdrop-blur-xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[32px] flex items-center justify-between px-6 py-3 border border-gray-100/50">
        
        <!-- Home -->
        <button 
          @click="$emit('update:modelValue', 'home')"
          class="flex flex-col items-center justify-center space-y-1 transition-all duration-300"
          :class="modelValue === 'home' ? 'text-amber-700 scale-110' : 'text-gray-400 hover:text-gray-600'"
        >
          <HomeIcon :size="24" :stroke-width="modelValue === 'home' ? 2.5 : 2" />
          <span class="text-[10px] font-bold">Home</span>
        </button>

        <!-- Search -->
        <button 
          @click="$emit('update:modelValue', 'search')"
          class="flex flex-col items-center justify-center space-y-1 transition-all duration-300"
          :class="modelValue === 'search' ? 'text-amber-700 scale-110' : 'text-gray-400 hover:text-gray-600'"
        >
          <SearchIcon :size="24" :stroke-width="modelValue === 'search' ? 2.5 : 2" />
          <span class="text-[10px] font-bold">Search</span>
        </button>

        <!-- Spacer for center FAB -->
        <div class="w-16"></div>

        <!-- History -->
        <button 
          @click="$emit('update:modelValue', 'history')"
          class="flex flex-col items-center justify-center space-y-1 transition-all duration-300"
          :class="modelValue === 'history' ? 'text-amber-700 scale-110' : 'text-gray-400 hover:text-gray-600'"
        >
          <ClockIcon :size="24" :stroke-width="modelValue === 'history' ? 2.5 : 2" />
          <span class="text-[10px] font-bold">History</span>
        </button>

        <!-- Profile -->
        <button 
          @click="$emit('update:modelValue', 'settings')"
          class="flex flex-col items-center justify-center space-y-1 transition-all duration-300"
          :class="modelValue === 'settings' ? 'text-amber-700 scale-110' : 'text-gray-400 hover:text-gray-600'"
        >
          <UserIcon :size="24" :stroke-width="modelValue === 'settings' ? 2.5 : 2" />
          <span class="text-[10px] font-bold">Profile</span>
        </button>
      </div>

      <!-- Floating Plus Button -->
      <button 
        @click="$emit('update:modelValue', 'add')"
        class="absolute left-1/2 -top-6 -translate-x-1/2 w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_-5px_rgba(180,83,9,0.5)] hover:bg-amber-800 hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white"
      >
        <PlusIcon :size="32" :stroke-width="3" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Plus as PlusIcon, 
  Clock as ClockIcon, 
  User as UserIcon 
} from 'lucide-vue-next';

defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>
