<template>
  <div class="bg-white p-3 rounded-3xl border border-gray-100 shadow-inner bg-gray-50/20">
    <!-- Header with Back Button & Breadcrumbs -->
    <div class="flex flex-col space-y-2 mb-4">
      <div class="flex items-center">
        <button 
          v-if="path.length > 0" 
          @click="goBack" 
          class="mr-3 p-2 text-gray-500 hover:text-gray-800 bg-white shadow-sm border border-gray-100 rounded-xl transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <h2 class="text-lg font-black text-gray-800 tracking-tight">
          {{ currentCategoryName }}
        </h2>
      </div>

      <!-- Breadcrumbs -->
      <div v-if="path.length > 0" class="flex flex-wrap gap-1 text-[10px] uppercase font-bold tracking-widest text-gray-400 items-center">
        <span class="cursor-pointer hover:text-purple-600 transition-colors" @click="goToLevel(-1)">All</span>
        <template v-for="(p, index) in path" :key="index">
          <span class="mx-1 text-gray-300">/</span>
          <span 
            class="cursor-pointer hover:text-purple-600 transition-colors" 
            @click="goToLevel(index)"
            :class="{ 'text-purple-600': index === path.length - 1 }"
          >
            {{ p.name }}
          </span>
        </template>
      </div>
    </div>

    <!-- Options List -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <div
        v-for="item in currentOptions"
        :key="item.id"
        class="relative group"
      >
        <button
          @click="selectItem(item)"
          class="w-full flex flex-col items-center justify-center p-3 rounded-xl border-2 border-transparent bg-white shadow-sm hover:border-purple-200 hover:shadow-md transition-all duration-300 h-full min-h-[70px]"
        >
          <span 
            class="font-bold text-gray-800 text-center leading-tight text-xs"
          >
            {{ item.name }}
          </span>
        </button>

        <!-- Selection Button for Categories -->
        <button 
          @click.stop="emit('flavor-selected', item)"
          class="absolute top-1 right-1 w-7 h-7 bg-purple-100/80 text-purple-700 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-90 z-10"
          title="Add this as flavor"
        >
          <PlusIcon :size="14" :stroke-width="4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Plus as PlusIcon } from 'lucide-vue-next';
import flavorLexicon from '../data/flavorLexicon.json';

const emit = defineEmits(['flavor-selected']);

// --- Flatten the JSON tree into a lookup map with stable IDs ---
const nodeMap = new Map(); // id -> node with {id, name, children, parentId}
let _idCounter = 1;

function buildMap(nodes, parentId = null) {
  return nodes.map(node => {
    const id = _idCounter++;
    const mapped = {
      id,
      name: node.name,
      parentId,
      hasChildren: !!(node.children && node.children.length > 0)
    };
    nodeMap.set(id, mapped);
    if (node.children) buildMap(node.children, id);
    return mapped;
  });
}

const rootNodes = buildMap(flavorLexicon.children);

// --- State ---
const path = ref([]); // [{id, name}]

const currentCategoryName = computed(() => {
  if (path.value.length === 0) return 'Flavors';
  return path.value[path.value.length - 1].name;
});

const currentOptions = computed(() => {
  if (path.value.length === 0) return rootNodes;
  const parentId = path.value[path.value.length - 1].id;
  return [...nodeMap.values()].filter(n => n.parentId === parentId);
});

// Actions
const selectItem = (item) => {
  if (item.hasChildren) {
    path.value.push({ id: item.id, name: item.name });
  } else {
    emit('flavor-selected', { id: item.id, name: item.name });
  }
};

const goBack = () => {
  if (path.value.length > 0) path.value.pop();
};

const goToLevel = (index) => {
  if (index === -1) {
    path.value = [];
  } else {
    path.value = path.value.slice(0, index + 1);
  }
};
</script>
