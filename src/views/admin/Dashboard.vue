<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else class="space-y-8">
    <header class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p class="text-slate-500">Real-time store performance and analytics</p>
      </div>
      <div class="flex items-center space-x-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm w-fit">
        <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0"></span>
        <span class="font-medium text-slate-600">Live Traffic Tracking</span>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, key) in stats.cards" :key="key" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-primary-500 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <span class="material-icons">{{ getIcon(key) }}</span>
          </div>
          <span class="text-green-500 text-xs font-bold">+12%</span>
        </div>
        <p class="text-slate-500 text-sm font-medium capitalize">{{ formatKey(key) }}</p>
        <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ stat }}</h3>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold mb-6">Traffic & Conversion</h3>
        <div class="h-64 relative w-full">
          <Bar :data="chartData" :options="chartOptions" v-if="stats.cards.totalSessions !== undefined" />
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold mb-6">Top Products</h3>
        <div class="space-y-4">
          <div v-for="prod in stats.topProducts" :key="prod._id" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div class="flex items-center space-x-4">
              <img :src="'https://rizwan-store-api.onrender.com/uploads/' + prod.thumbnail" loading="lazy" class="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div>
                <p class="font-bold text-slate-900 truncate max-w-[150px]">{{ prod.title }}</p>
                <p class="text-xs text-slate-500">{{ prod.viewCount }} views</p>
              </div>
            </div>
            <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">₹{{ prod.finalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await axios.get('https://rizwan-store-api.onrender.com/api/inquiries/stats');
    stats.value = res.data;
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to load dashboard stats.');
  } finally {
    isLoading.value = false;
  }
});

const getIcon = (key) => {
  const icons = {
    totalSessions: 'visibility',
    totalProducts: 'inventory_2',
    totalInquiries: 'request_quote',
    conversionRate: 'insights',
    cartAbandonment: 'shopping_cart_checkout'
  };
  return icons[key] || 'info';
};

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1');
};

const chartData = computed(() => ({
  labels: ['Traffic & Conversion'],
  datasets: [
    {
      label: 'Visitors',
      backgroundColor: '#cbd5e1', // slate-300
      data: [stats.value.cards.totalSessions || 0],
      borderRadius: 6
    },
    {
      label: 'Leads',
      backgroundColor: '#0ea5e9', // primary-500
      data: [stats.value.cards.totalInquiries || 0],
      borderRadius: 6
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 }
    }
  }
};
</script>
