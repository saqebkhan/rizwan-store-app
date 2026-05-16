<template>
  <div class="space-y-12 pb-20">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Management Hub</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
        </div>
        <div class="bg-slate-950 px-5 py-2.5 rounded-xl shadow-lg border border-white/5">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3 inline-block"></span>
          <span class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/70">Live Ecosystem Monitoring</span>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div v-for="(stat, key) in stats.cards" :key="key" 
          class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 group hover:border-primary-500 hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
          
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div class="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
              <span class="material-icons text-2xl">{{ getIcon(key) }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-green-500 text-[10px] font-black uppercase tracking-widest">+12.4%</span>
              <span class="text-[8px] text-slate-300 font-bold uppercase tracking-widest">Growth</span>
            </div>
          </div>
          
          <div class="relative z-10">
            <p class="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{{ formatKey(key) }}</p>
            <h3 class="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{{ stat }}</h3>
          </div>
        </div>
      </div>

      <!-- Main Analytics Row -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Analytics Chart -->
        <div class="xl:col-span-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
          <div class="flex items-center justify-between mb-12">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Growth</h3>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Traffic vs Conversion Metrics</p>
            </div>
            <div class="flex space-x-2">
              <div class="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl">
                <div class="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Visitors</span>
              </div>
              <div class="flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-xl">
                <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span class="text-[10px] font-black uppercase tracking-widest text-primary-600">Leads</span>
              </div>
            </div>
          </div>
          <div class="h-[400px] relative w-full">
            <Bar :data="chartData" :options="chartOptions" v-if="stats.cards.totalSessions !== undefined" />
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
          <div class="mb-12">
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">Performance Ranking</h3>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Top Viewed Collections</p>
          </div>
          <div class="space-y-6">
            <div v-for="prod in stats.topProducts" :key="prod._id" class="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100 group">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-white">
                  <img :src="getImageUrl(prod.thumbnail)" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div>
                  <p class="font-black text-slate-900 text-sm tracking-tight mb-1 line-clamp-1">{{ prod.title }}</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ prod.viewCount }} Interactions</p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-slate-900 font-black text-sm tracking-tighter">₹{{ prod.finalPrice }}</span>
                <span class="text-[8px] text-primary-600 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { inquiryService } from '../../services/api';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const loading = ref(false);

const stats = ref({
  cards: {
    totalSessions: 0,
    totalProducts: 0,
    totalInquiries: 0,
    conversionRate: '0%',
    cartAbandonment: 0
  },
  topProducts: []
});

onMounted(async () => {
  try {
    loading.value = true;
    const data = await inquiryService.getStats();
    stats.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
});

const getIcon = (key) => {
  const icons = {
    totalSessions: 'sensors',
    totalProducts: 'inventory_2',
    totalInquiries: 'shopping_bag',
    conversionRate: 'auto_graph',
    cartAbandonment: 'shopping_cart_checkout'
  };
  return icons[key] || 'info';
};

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const chartData = computed(() => ({
  labels: ['Global Ecosystem Analytics'],
  datasets: [
    {
      label: 'Unique Visitors',
      backgroundColor: '#f1f5f9',
      hoverBackgroundColor: '#e2e8f0',
      data: [stats.value.cards.totalSessions || 0],
      borderRadius: 20,
      barThickness: 60
    },
    {
      label: 'Converted Leads',
      backgroundColor: '#0f172a',
      hoverBackgroundColor: '#000',
      data: [stats.value.cards.totalInquiries || 0],
      borderRadius: 20,
      barThickness: 60
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { size: 12, weight: '900' },
      bodyFont: { size: 11, weight: '700' },
      padding: 16,
      cornerRadius: 16,
      displayColors: false
    }
  },
  scales: {
    y: {
      grid: { display: false },
      ticks: { 
        font: { size: 10, weight: '700' },
        color: '#94a3b8'
      }
    },
    x: {
      grid: { display: false },
      ticks: { 
        font: { size: 10, weight: '700' },
        color: '#94a3b8'
      }
    }
  }
};
</script>
