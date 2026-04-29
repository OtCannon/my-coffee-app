<template>
  <div class="space-y-8 pb-24">
    <h2 class="text-2xl font-black text-gray-900">Sensory Analytics</h2>

    <div v-if="records.length === 0" class="text-center py-20 text-gray-400 font-medium bg-white rounded-3xl border border-gray-100">
      No data available to analyze yet.
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div class="text-xs font-bold text-gray-400 uppercase mb-1">Total Brews</div>
          <div class="text-3xl font-black text-purple-600">{{ records.length }}</div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div class="text-xs font-bold text-gray-400 uppercase mb-1">Avg Rating</div>
          <div class="text-3xl font-black text-amber-600">{{ avgRating }}</div>
        </div>
      </div>

      <!-- Preference Analysis -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Preference Drivers</h3>
        
        <div v-if="correlations.length > 0" class="space-y-6">
          <div v-for="corr in correlations" :key="corr.label" class="space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="font-bold text-gray-700">{{ corr.label }} Correlation</span>
              <span :class="corr.colorClass" class="font-black">{{ corr.value.toFixed(2) }}</span>
            </div>
            <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div 
                v-if="corr.value < 0" 
                class="bg-rose-500 transition-all duration-1000"
                :style="{ width: Math.abs(corr.value * 100) + '%', marginLeft: 'auto', marginRight: '50%' }"
              ></div>
              <div 
                v-if="corr.value >= 0" 
                class="bg-emerald-500 transition-all duration-1000"
                :style="{ width: (corr.value * 100) + '%', marginLeft: '50%' }"
              ></div>
            </div>
            <p class="text-[11px] text-gray-400 font-medium italic">
              {{ corr.description }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-4 text-xs text-gray-400">
          More data needed for correlation analysis.
        </div>
      </div>

      <!-- Flavor Impact -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Top Flavor Preference</h3>
        <div v-if="topFlavors.length > 0" class="grid grid-cols-1 gap-3">
          <div v-for="flavor in topFlavors" :key="flavor.name" class="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-100/50">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
              <span class="text-sm font-bold text-amber-900">{{ flavor.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-bold text-amber-500 uppercase">Avg Score</span>
              <span class="text-lg font-black text-amber-700">{{ flavor.avgScore.toFixed(1) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-xs text-gray-400">
          Try more varieties to see flavor patterns.
        </div>
      </div>

      <!-- Discovery Insights -->
      <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg text-white">
        <h3 class="text-sm font-bold opacity-80 mb-6 uppercase tracking-wider">Discovery Insights</h3>
        <div v-if="discoveryInsight" class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="bg-white/20 p-2 rounded-xl">
              <span class="text-2xl">💡</span>
            </div>
            <div>
              <div class="font-black text-lg mb-1">{{ discoveryInsight.title }}</div>
              <p class="text-sm opacity-90 leading-relaxed">{{ discoveryInsight.text }}</p>
            </div>
          </div>
          <div v-if="discoveryInsight.suggestion" class="bg-white/10 p-4 rounded-2xl border border-white/10">
            <div class="text-[10px] font-bold uppercase opacity-60 mb-1">Active Exploration</div>
            <div class="text-sm font-bold">{{ discoveryInsight.suggestion }}</div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-sm opacity-60">
          Accumulate 10 brews to unlock predictive insights.
        </div>
      </div>

      <!-- Average Scores (Radar Chart) -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Average Flavor Profile</h3>
        <div class="h-64">
          <Radar :data="radarData" :options="radarOptions" />
        </div>
      </div>

      <!-- Brews by Month (Bar Chart) -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Monthly Activity</h3>
        <div class="h-64">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>

      <!-- Origin Distribution (Doughnut Chart) -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Origin Distribution</h3>
        <div class="h-64">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Radar, Doughnut } from 'vue-chartjs';
import * as db from '../utils/db.js';

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,
  RadialLinearScale, PointElement, LineElement, Filler, ArcElement
);

const records = ref([]);

onMounted(async () => {
  const history = await db.getAllRecords();
  records.value = history.filter(r => r.isActive !== false);
});

// Stats calculations
const avgRating = computed(() => {
  if (records.value.length === 0) return 0;
  const sum = records.value.reduce((acc, r) => acc + parseFloat(r.score || 0), 0);
  return (sum / records.value.length).toFixed(1);
});

// Pearson Correlation Logic
const calculateCorrelation = (x, y) => {
  const n = x.length;
  if (n < 5) return 0; // Require at least 5 records for meaningful correlation
  const muX = x.reduce((a, b) => a + b, 0) / n;
  const muY = y.reduce((a, b) => a + b, 0) / n;
  
  let nmr = 0;
  let dnmX = 0;
  let dnmY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - muX;
    const dy = y[i] - muY;
    nmr += dx * dy;
    dnmX += dx * dx;
    dnmY += dy * dy;
  }
  
  if (dnmX === 0 || dnmY === 0) return 0;
  return nmr / (Math.sqrt(dnmX) * Math.sqrt(dnmY));
};

const correlations = computed(() => {
  if (records.value.length < 5) return [];
  
  // 排除 roastLevel 為 0 (Unknown) 的紀錄
  const roastRecords = records.value.filter(r => r.roastLevel && r.roastLevel !== 0);
  
  const scores = records.value.map(r => parseFloat(r.score));
  const acidity = records.value.map(r => parseFloat(r.scores.acidity));
  const bitterness = records.value.map(r => parseFloat(r.scores.bitterness));
  const sweetness = records.value.map(r => parseFloat(r.scores.sweetness || 3));
  const body = records.value.map(r => parseFloat(r.scores.body));
  
  const roastScores = roastRecords.map(r => parseFloat(r.score));
  const roastLevels = roastRecords.map(r => parseFloat(r.roastLevel));
  
  const results = [
    { label: 'Acidity', value: calculateCorrelation(acidity, scores) },
    { label: 'Bitterness', value: calculateCorrelation(bitterness, scores) },
    { label: 'Sweetness', value: calculateCorrelation(sweetness, scores) },
    { label: 'Body', value: calculateCorrelation(body, scores) },
    { label: 'Roast Depth', value: calculateCorrelation(roastLevels, roastScores) }
  ];
  
  return results.map(r => ({
    ...r,
    colorClass: r.value > 0.3 ? 'text-emerald-600' : r.value < -0.3 ? 'text-rose-600' : 'text-gray-500',
    description: r.value > 0.5 ? `Strong positive driver: Higher ${r.label.toLowerCase()} strongly improves your rating.` :
                 r.value > 0.2 ? `Positive driver: You tend to prefer more ${r.label.toLowerCase()}.` :
                 r.value < -0.5 ? `Strong negative driver: Higher ${r.label.toLowerCase()} significantly lowers your rating.` :
                 r.value < -0.2 ? `Negative driver: You tend to avoid high ${r.label.toLowerCase()}.` :
                 `Neutral factor: ${r.label} doesn't seem to impact your rating much.`
  }));
});

const topFlavors = computed(() => {
  const flavorStats = {};
  
  records.value.forEach(r => {
    r.selectedFlavors.forEach(f => {
      if (!flavorStats[f.name]) {
        flavorStats[f.name] = { totalScore: 0, count: 0 };
      }
      flavorStats[f.name].totalScore += parseFloat(r.score);
      flavorStats[f.name].count += 1;
    });
  });
  
  return Object.entries(flavorStats)
    .map(([name, stats]) => ({
      name,
      avgScore: stats.totalScore / stats.count,
      count: stats.count
    }))
    .filter(f => f.count >= 2) // At least 2 occurrences
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3); // Top 3
});

const discoveryInsight = computed(() => {
  if (records.value.length < 10) return null;

  const top = topFlavors.value[0];
  const recentRecords = records.value.slice(0, 5);
  const recentFlavors = recentRecords.flatMap(r => r.selectedFlavors.map(f => f.name));
  
  // 1. Check for "Missing Favorite"
  if (top && !recentFlavors.includes(top.name)) {
    return {
      title: "Missing Your Favorite?",
      text: `You haven't logged any ${top.name} notes in your last 5 brews, even though it's one of your highest-rated attributes (Avg: ${top.avgScore.toFixed(1)}).`,
      suggestion: `Look for a coffee with ${top.name} notes for your next brew!`
    };
  }

  // 2. Positive Driver Insight
  const bestDriver = correlations.value.sort((a, b) => b.value - a.value)[0];
  if (bestDriver && bestDriver.value > 0.4) {
    return {
      title: `${bestDriver.label} Enthusiast`,
      text: `Your data shows a statistically significant preference for ${bestDriver.label.toLowerCase()}. It's the most reliable predictor of a high rating for you.`,
      suggestion: `Try exploring different origins that are famous for high ${bestDriver.label.toLowerCase()}.`
    };
  }

  // 3. Variety Insight
  const uniqueFlavors = new Set(records.value.flatMap(r => r.selectedFlavors.map(f => f.name))).size;
  if (uniqueFlavors < 10) {
    return {
      title: "Expand Your Palate",
      text: "You've been sticking to a consistent set of flavor profiles.",
      suggestion: "Try a coffee with a flavor category you haven't explored yet, like Floral or Spice notes."
    };
  }

  return {
    title: "Consistent Quality",
    text: "Your ratings are very consistent. You've found a 'sweet spot' in your coffee preferences.",
    suggestion: "Maybe it's time to try a different processing method to see how it affects your favorite flavors."
  };
});

// Radar Chart Data (Avg Scores)
const radarData = computed(() => {
  const avg = { acidity: 0, bitterness: 0, sweetness: 0, body: 0 };
  records.value.forEach(r => {
    avg.acidity += parseFloat(r.scores.acidity || 3);
    avg.bitterness += parseFloat(r.scores.bitterness || 3);
    avg.sweetness += parseFloat(r.scores.sweetness || 3);
    avg.body += parseFloat(r.scores.body || 3);
  });
  const count = records.value.length;
  return {
    labels: ['Acidity', 'Bitterness', 'Sweetness', 'Body'],
    datasets: [{
      label: 'Average Score',
      data: [avg.acidity / count, avg.bitterness / count, avg.sweetness / count, avg.body / count],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgba(147, 51, 234, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(147, 51, 234, 1)',
    }]
  };
});

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 5,
      ticks: { stepSize: 1, display: false }
    }
  },
  plugins: { legend: { display: false } }
};

// Bar Chart Data (Monthly)
const barData = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = new Array(12).fill(0);
  records.value.forEach(r => {
    const month = new Date(r.date).getMonth();
    counts[month]++;
  });
  return {
    labels: months,
    datasets: [{
      label: 'Brews',
      data: counts,
      backgroundColor: '#9333ea',
      borderRadius: 8
    }]
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
};

// Doughnut Chart (Origin)
const doughnutData = computed(() => {
  const origins = {};
  records.value.forEach(r => {
    origins[r.beanOrigin] = (origins[r.beanOrigin] || 0) + 1;
  });
  return {
    labels: Object.keys(origins),
    datasets: [{
      data: Object.values(origins),
      backgroundColor: ['#b45309', '#059669', '#2563eb', '#db2777', '#7c3aed'],
      borderWidth: 0
    }]
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      position: 'bottom',
      labels: { boxWidth: 12, usePointStyle: true, padding: 20 } 
    } 
  }
};
</script>
