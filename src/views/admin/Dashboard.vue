<template>
  <div class="space-y-8 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-8">
      <!-- High-Density Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
        <div class="relative z-10">
          <span class="text-primary-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-2 block">Executive Control Center</span>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight leading-none">Ecosystem Command</h1>
        </div>
        <div class="flex items-center gap-6 relative z-10">
          <div class="text-right hidden sm:block">
            <p class="text-[10px] font-black text-white/50 uppercase tracking-widest">Active Nodes</p>
            <p class="text-xl font-black">Online</p>
          </div>
          <div class="w-1.5 h-12 bg-white/10 rounded-full hidden sm:block"></div>
          <div class="bg-white/10 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3 inline-block shadow-[0_0_15px_rgba(34,197,94,0.5)]"></span>
            <span class="text-[10px] font-black uppercase tracking-widest text-white/70">Live Monitoring Active</span>
          </div>
        </div>
      </header>

      <!-- High-Density Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div v-for="(stat, key) in stats.cards" :key="key" 
          @click="handleStatClick(key)"
          class="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-primary-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          :class="{'cursor-pointer active:scale-95': isClickable(key)}">
          
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
              <span class="material-icons text-xl">{{ getIcon(key) }}</span>
            </div>
            <div v-if="stat.growth !== undefined" class="text-[8px] font-black uppercase tracking-widest" :class="stat.growth >= 0 ? 'text-green-500' : 'text-primary-500'">
              {{ stat.growth >= 0 ? '+' : '' }}{{ stat.growth }}%
            </div>
          </div>
          
          <div>
            <p class="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 truncate">{{ formatKey(key) }}</p>
            <h3 class="text-lg md:text-xl font-black text-slate-900 tracking-tighter">
              {{ typeof stat === 'object' ? stat.value : stat }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Main Intelligence Hub -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- Scrollable Advanced Performance Visualizer -->
        <div class="xl:col-span-3 bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Intelligence</h3>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Real-time interaction trajectory</p>
            </div>
            <div class="flex border-b-2 border-slate-50">
              <button @click="period = 'weekly'" :class="period === 'weekly' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-400'" class="px-6 py-3 border-b-2 -mb-[2px] text-[10px] font-black uppercase tracking-widest transition-all">Weekly</button>
              <button @click="period = 'monthly'" :class="period === 'monthly' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-400'" class="px-6 py-3 border-b-2 -mb-[2px] text-[10px] font-black uppercase tracking-widest transition-all">Monthly</button>
            </div>
          </div>

          <!-- Horizontal Scrollable Performance Charts -->
          <div class="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
            <div v-for="(val, label) in stats.performance[period]" :key="label" 
              class="min-w-[280px] flex-shrink-0 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100/50 group snap-center relative overflow-hidden">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl"></div>
              
              <div class="flex items-center justify-between mb-8 relative z-10">
                <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest tracking-[0.2em]">{{ label }} Matrix</span>
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span class="material-icons text-primary-500 text-sm">analytics</span>
                </div>
              </div>
              
              <div class="relative z-10 flex items-end justify-between gap-4 mb-8">
                <h4 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                  {{ label === 'growth' ? val + '%' : val }}
                </h4>
                <div v-if="label !== 'growth'" class="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 flex items-center">
                  <span class="material-icons text-xs mr-1">trending_up</span> Optimized
                </div>
              </div>
              
              <!-- Enhanced Micro-Graph -->
              <div class="space-y-3 relative z-10">
                <div class="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Efficiency</span>
                  <span>{{ label === 'growth' ? val + '%' : '100%' }}</span>
                </div>
                <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-slate-900 transition-all duration-1000 ease-out" :style="{ width: label === 'growth' ? val + '%' : '85%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Utility Row -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                <span class="material-icons text-xl">speed</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Response</p>
                <p class="font-black text-slate-900 tracking-tight">1.2s Latency</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white">
                <span class="material-icons text-xl">security</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ecosystem Safety</p>
                <p class="font-black text-slate-900 tracking-tight">Hardened SSL</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <span class="material-icons text-xl">rocket_launch</span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p class="font-black text-slate-900 tracking-tight">Scaled Nodes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact Moderation Scout -->
        <div class="flex flex-col gap-6">
          <div class="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex-1">
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-primary-600/30 rounded-full blur-[60px]"></div>
            
            <div class="relative z-10">
              <div class="mb-8">
                <span class="text-primary-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Action Required</span>
                <h3 class="text-xl font-black tracking-tight leading-tight">Moderation Hub</h3>
              </div>

              <div class="space-y-4">
                <div @click="router.push('/admin/leads')" class="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/10 transition cursor-pointer group flex items-center justify-between">
                  <div>
                    <p class="text-[8px] font-black uppercase tracking-widest text-primary-400 mb-1">Pending Leads</p>
                    <p class="text-xl font-black">{{ stats.cards.pendingLeads }}</p>
                  </div>
                  <span class="material-icons text-primary-400 group-hover:translate-x-1 transition">chevron_right</span>
                </div>

                <div @click="router.push('/admin/leads')" class="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/10 transition cursor-pointer group flex items-center justify-between">
                  <div>
                    <p class="text-[8px] font-black uppercase tracking-widest text-amber-400 mb-1">Enquiries</p>
                    <p class="text-xl font-black">{{ stats.cards.pendingInquiries }}</p>
                  </div>
                  <span class="material-icons text-amber-400 group-hover:translate-x-1 transition">chevron_right</span>
                </div>
              </div>

              <button @click="router.push('/admin/leads')" class="mt-8 w-full bg-white text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-primary-500 hover:text-white transition-all shadow-lg">
                Enter Hub
              </button>
            </div>
          </div>

          <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <span class="text-primary-600 font-bold uppercase tracking-widest text-[8px] mb-2 block">Network Status</span>
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden">
                  <img :src="'https://i.pravatar.cc/100?img=' + i" class="w-full h-full object-cover" />
                </div>
              </div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Admins Active</p>
            </div>
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
  const labels = {
    totalSessions: 'Digital Traffic',
    totalLeads: 'Conversion Leads',
    totalInquiries: 'Ecosystem Orders',
    conversionRate: 'Conv Accuracy',
    pendingLeads: 'Pending Leads',
    pendingInquiries: 'Enquiries',
    totalProducts: 'Inventory Depth'
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const getIcon = (key) => {
  const icons = {
    totalSessions: 'visibility',
    totalLeads: 'sensors',
    totalInquiries: 'shopping_bag',
    conversionRate: 'trending_up',
    pendingLeads: 'contact_support',
    pendingInquiries: 'pending_actions',
    totalProducts: 'inventory_2'
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
