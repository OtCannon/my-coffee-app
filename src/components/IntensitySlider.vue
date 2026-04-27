<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Intensity</h3>
        <p class="text-sm text-gray-500">Score from 1 to 15</p>
      </div>
      <div class="text-2xl font-bold text-purple-600 bg-purple-100 border-2 border-purple-200 w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
        {{ modelValue }}
      </div>
    </div>
    
    <div class="relative w-full pt-2 pb-2">
      <input 
        id="intensity" 
        type="range" 
        min="1" 
        max="15" 
        step="1" 
        :value="modelValue"
        @input="$emit('update:modelValue', Number($event.target.value))"
        class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 shadow-inner"
      >
      <div class="flex justify-between text-xs font-medium text-gray-400 mt-3 px-1">
        <span>1 (Weak)</span>
        <span>5</span>
        <span>10</span>
        <span>15 (Strong)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Number,
    required: true
  }
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Custom styling for range input if accent-color isn't enough */
input[type=range] {
  accent-color: #9333ea; /* Tailwind purple-600 */
}
input[type=range]::-webkit-slider-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
