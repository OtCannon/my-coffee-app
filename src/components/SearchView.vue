<template>
  <div class="space-y-6">
    <!-- Search Bar -->
    <div class="relative">
      <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="搜尋店家、豆名或風味..."
        class="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#b45309] transition-all"
      />
    </div>

    <!-- Recommendations Toggle -->
    <div v-if="topPreferences.length > 0" class="flex flex-wrap gap-2">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-wider w-full mb-1">您的喜好</span>
      <div 
        v-for="pref in topPreferences" 
        :key="pref"
        class="px-3 py-1 bg-[#b45309]/10 text-[#b45309] rounded-full text-xs font-medium"
      >
        # {{ pref }}
      </div>
    </div>

    <!-- Results List -->
    <div class="space-y-4">
      <div v-if="filteredOfferings.length === 0" class="py-12 text-center text-gray-400">
        沒有找到符合的咖啡品項
      </div>

      <div 
        v-for="item in filteredOfferings" 
        :key="item.id"
        class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 group"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <span class="text-xs font-bold text-[#b45309] uppercase tracking-widest">{{ item.store }}</span>
            <h3 class="text-lg font-bold text-gray-900">{{ item.name }}</h3>
          </div>
          <div v-if="item.matchScore > 0" class="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100">
            <SparklesIcon :size="14" />
            <span class="text-[10px] font-bold uppercase">推薦</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-4">
          <span v-for="tag in [item.origin, item.process, item.roast]" :key="tag" class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] font-medium border border-gray-100">
            {{ tag }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <div 
            v-for="flavor in item.flavors" 
            :key="flavor"
            :class="[
              'text-xs px-2 py-1 rounded-md',
              userPreferences.includes(flavor) ? 'bg-[#b45309] text-white' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ flavor }}
          </div>
        </div>

        <p class="text-sm text-gray-500 italic mb-4 leading-relaxed">
          "{{ item.description }}"
        </p>

        <div class="flex items-center justify-between pt-4 border-t border-gray-50">
          <span class="font-bold text-gray-900">NT$ {{ item.price }}</span>
          <button class="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#b45309] transition-colors">
            查看詳情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search as SearchIcon, Sparkles as SparklesIcon } from 'lucide-vue-next';
import { searchOfferings } from '../utils/sqlite.js';

const officialOfferings = ref([]);
const searchQuery = ref('');
const userPreferences = ref([]);
const topPreferences = ref([]);

const analyzePreferences = () => {
  try {
    // 這裡我們兼容兩個可能的 Key
    const historyData = localStorage.getItem('coffee_history') || localStorage.getItem('coffee_logs') || '[]';
    const history = JSON.parse(historyData);
    if (!Array.isArray(history) || history.length === 0) return;

    const flavorCounts = {};
    history.forEach(record => {
      // 兼容舊版整體評分 key 名稱
      const score = record.overallScore || record.score || 0;
      if (score < 4.5) return;

      const flavors = record.flavors || record.selectedFlavors || [];
      flavors.forEach(f => {
        // 兼容 path 結構或純字串/物件結構
        let name = '';
        if (f.path && Array.isArray(f.path)) name = f.path[f.path.length - 1];
        else if (f.name) name = f.name;
        else if (typeof f === 'string') name = f;

        if (name) flavorCounts[name] = (flavorCounts[name] || 0) + (score / 5);
      });
    });

    const sorted = Object.entries(flavorCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);
    
    userPreferences.value = sorted;
    topPreferences.value = sorted.slice(0, 5);
  } catch (e) {
    console.error("Analysis failed", e);
  }
};

onMounted(async () => {
  analyzePreferences();
  officialOfferings.value = await searchOfferings('');
});

const filteredOfferings = computed(() => {
  let list = officialOfferings.value.map(item => {
    const matches = (item.flavors || []).filter(f => userPreferences.value.includes(f));
    return { ...item, matchScore: matches.length };
  });

  return list.sort((a, b) => b.matchScore - a.matchScore || a.store.localeCompare(b.store));
});

import { watch } from 'vue';
watch(searchQuery, async (newQuery) => {
  officialOfferings.value = await searchOfferings(newQuery);
});

</script>
