<template>
  <div class="space-y-12 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Management Hub</span>
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
        </div>
        <div class="bg-slate-950 px-5 py-2.5 rounded-xl shadow-lg border border-white/5">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3 inline-block"></span>
          <span class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/70">Live Ecosystem Monitoring</span>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div v-for="(stat, key) in stats.cards" :key="key" 
          @click="handleStatClick(key)"
          class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 group hover:border-primary-500 hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
          :class="{'cursor-pointer hover:scale-[1.02] active:scale-95': isClickable(key)}">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
          
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div class="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
              <span class="material-icons text-2xl">{{ getIcon(key) }}</span>
            </div>
            <div v-if="key.includes('total')" class="flex flex-col items-end">
              <span class="text-green-500 text-[10px] font-black uppercase tracking-widest">+12.4%</span>
              <span class="text-[8px] text-slate-300 font-bold uppercase tracking-widest">Growth</span>
            </div>
            <div v-else-if="key.includes('pending')" class="flex flex-col items-end">
              <span class="bg-primary-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-bounce">Action</span>
            </div>
          </div>
          
          <div class="relative z-10">
            <p class="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{{ formatKey(key) }}</p>
            <h3 class="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{{ stat }}</h3>
          </div>
        </div>
      </div>

      <!-- Moderation & Performance -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Growth Chart -->
        <div class="xl:col-span-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
          <div class="flex items-center justify-between mb-12">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Performance</h3>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Growth vs Interaction Metrics</p>
            </div>
            <div class="flex bg-slate-50 p-1 rounded-2xl">
              <button @click="period = 'weekly'" :class="period === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Weekly</button>
              <button @click="period = 'monthly'" :class="period === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Monthly</button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div v-for="(val, label) in stats.performance[period]" :key="label" 
              class="relative pt-20 flex flex-col items-center">
              <div class="absolute top-0 w-full bg-slate-50 rounded-2xl overflow-hidden h-16">
                <div class="h-full bg-primary-500 transition-all duration-1000" :style="{ width: label === 'growth' ? val + '%' : '100%' }"></div>
              </div>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{{ label }}</p>
              <h4 class="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{{ label === 'growth' ? val + '%' : val }}</h4>
            </div>
          </div>
        </div>

        <!-- Moderation Scout -->
        <div class="bg-slate-950 p-10 md:p-12 rounded-[3rem] text-white shadow-[0_30px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"></div>
          
          <div class="relative z-10 h-full flex flex-col">
            <div class="mb-10">
              <span class="text-primary-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Moderation Scout</span>
              <h3 class="text-2xl font-black tracking-tight leading-tight">Attention Required In Ecosystem</h3>
            </div>

            <div class="space-y-6 flex-grow">
              <div @click="router.push('/admin/leads')" class="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition cursor-pointer group">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-primary-400">Pending Leads</span>
                  <span class="material-icons text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <p class="text-2xl font-black">{{ stats.cards.pendingLeads }} Prospects</p>
              </div>

              <div @click="router.push('/admin/leads')" class="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition cursor-pointer group">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-amber-400">Order Enquiries</span>
                  <span class="material-icons text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <p class="text-2xl font-black">{{ stats.cards.pendingInquiries }} Awaiting</p>
              </div>
            </div>

            <button @click="router.push('/admin/leads')" class="mt-10 w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-500 hover:text-white transition-all shadow-xl">
              Enter Moderation Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { inquiryService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const router = useRouter();
const loading = ref(true);
const stats = ref({
  cards: {},
  performance: { weekly: {}, monthly: {} },
  topProducts: []
});
const period = ref('weekly');

const fetchStats = async () => {
  try {
    loading.value = true;
    const data = await inquiryService.getStats();
    stats.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const getIcon = (key) => {
  const icons = {
    totalSessions: 'visibility',
    totalLeads: 'sensors',
    totalInquiries: 'shopping_bag',
    conversionRate: 'trending_up',
    pendingLeads: 'contact_support',
    pendingInquiries: 'pending_actions',
    cartAbandonment: 'shopping_cart_checkout'
  };
  return icons[key] || 'insert_chart';
};

const isClickable = (key) => ['pendingLeads', 'pendingInquiries', 'totalLeads', 'totalInquiries'].includes(key);

const handleStatClick = (key) => {
  if (isClickable(key)) {
    router.push('/admin/leads');
  }
};
</script>
