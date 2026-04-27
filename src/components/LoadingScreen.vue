<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-10">
      <div class="mb-8 relative">
        <div class="text-6xl animate-bounce-slow">☕</div>
        <div class="absolute -bottom-2 -right-2 text-2xl animate-pulse">✨</div>
      </div>
      
      <div class="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          class="bg-[#b45309] h-full transition-all duration-500 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      
      <div class="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">
        {{ loadingText }}
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 1500
  }
});

const emit = defineEmits(['finished']);

const isLoading = ref(true);
const progress = ref(0);
const loadingText = ref('Initializing...');

const texts = ['Waking up beans...', 'Grinding lexicon...', 'Brewing your history...', 'Filtering flavors...'];

onMounted(() => {
  // Safety fallback: ensure loading finishes even if requestAnimationFrame is throttled
  const fallback = setTimeout(() => {
    if (isLoading.value) {
      progress.value = 100;
      isLoading.value = false;
      emit('finished');
    }
  }, 3500);

  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    
    progress.value = Math.min((elapsed / props.duration) * 100, 100);
    
    // Change text based on progress
    const textIdx = Math.min(Math.floor((progress.value / 100) * texts.length), texts.length - 1);
    loadingText.value = texts[textIdx];

    if (elapsed < props.duration) {
      window.requestAnimationFrame(step);
    } else {
      clearTimeout(fallback);
      setTimeout(() => {
        isLoading.value = false;
        emit('finished');
      }, 200);
    }
  };
  
  window.requestAnimationFrame(step);
});
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
