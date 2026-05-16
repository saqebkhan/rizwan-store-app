<template>
  <div class="space-y-12 pb-32">
    <!-- Skeleton Loading State -->
    <div v-if="loading && combinedList.length === 0" class="space-y-12">
      <div class="flex justify-between items-end gap-6">
        <div class="space-y-4 w-64">
          <div class="h-3 w-24 bg-slate-100 rounded-full animate-pulse"></div>
          <div class="h-10 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>
        <div class="h-14 w-48 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
      <div class="space-y-6">
        <div v-for="i in 3" :key="i" class="h-48 w-full bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
      </div>
    </div>

    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Conversion Hub</span>
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Active Interests</h1>
        </div>
        <div class="flex space-x-3">
          <button class="w-full md:w-auto bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl">
            Export Ecosystem Data
          </button>
        </div>
      </header>

      <!-- Combined List -->
      <div class="grid grid-cols-1 gap-6">
        <div v-for="item in combinedList" :key="item._id" :id="'item-' + item._id"
          class="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-500 group relative"
          :class="{ 'ring-4 ring-primary-500 ring-offset-4 animate-pulse-soft': highlightedId === item._id }">
          <div class="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <!-- Type & Customer Info -->
            <div class="flex items-start space-x-4 md:space-x-6">
              <div class="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-inner"
                :class="item.type === 'Inquiry' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'">
                <span class="material-icons text-2xl md:text-3xl">{{ item.type === 'Inquiry' ? 'shopping_bag' : 'sensors' }}</span>
              </div>
              <div class="flex-grow">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="text-[7px] md:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                    :class="item.type === 'Inquiry' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'">
                    {{ item.type === 'Inquiry' ? 'Order Enquiry' : 'Instant Lead' }}
                  </span>
                  <span class="text-[7px] md:text-[9px] text-slate-300 font-bold uppercase tracking-widest whitespace-nowrap">{{ timeAgo(item.createdAt) }}</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-1">{{ item.fullName || item.name }}</h3>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                  <a :href="'tel:' + item.phone" class="text-xs font-bold text-slate-500 hover:text-primary-600 transition flex items-center gap-1">
                    <span class="material-icons text-xs">call</span>
                    {{ item.phone }}
                  </a>
                  <span v-if="item.city" class="text-[8px] md:text-[10px] text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span class="material-icons text-[10px]">location_on</span>
                    {{ item.city }}, {{ item.state }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detail Section -->
            <div class="flex-1 max-w-md w-full">
              <div v-if="item.type === 'Inquiry'" class="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                <div class="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Inquiry Selection</span>
                  <span class="text-primary-600">₹{{ item.totalAmount }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(p, i) in item.products" :key="i" class="text-[8px] md:text-[10px] font-black text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                    {{ p.name }} <span class="text-slate-300 ml-1">×{{ p.quantity }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="flex items-center space-x-3 p-4 md:p-6 bg-slate-50/50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                <div class="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                  <span class="material-icons text-lg">contact_support</span>
                </div>
                <div>
                  <p class="text-[10px] md:text-xs font-black text-slate-900 tracking-tight">Express Interest Captured</p>
                  <p class="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting Initial Contact</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto">
              <div v-if="item.sessionDuration" class="flex items-center space-x-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg">
                <span class="material-icons text-[10px]">timer</span>
                <span class="text-[8px] font-black uppercase tracking-widest">{{ formatDuration(item.sessionDuration) }}</span>
              </div>
              
              <select
                @change="updateStatus(item, $event.target.value)" 
                :class="statusClass(item.status)"
                class="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl outline-none border-none cursor-pointer shadow-lg transition-all active:scale-95"
              >
                <option value="pending" :selected="item.status === 'pending'">Pending</option>
                <option value="contacted" :selected="item.status === 'contacted'">Contacted</option>
                <option value="completed" :selected="item.status === 'completed'">Completed</option>
              </select>
            </div>

          </div>
        </div>
        
        <div v-if="combinedList.length === 0 && !loading" class="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <span class="material-icons text-7xl text-slate-200 mb-6">dynamic_feed</span>
          <p class="text-slate-400 font-black uppercase tracking-widest text-sm">No activity recorded yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryService, leadService } from '../../services/api';
import { useToast } from '../../composables/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const route = useRoute();
const toast = useToast();
const inquiries = ref([]);
const leads = ref([]);
const loading = ref(false);
const highlightedId = ref(null);

const combinedList = computed(() => {
  const merged = [
    ...inquiries.value.map(i => ({ ...i, type: 'Inquiry' })),
    ...leads.value.map(l => ({ ...l, type: 'Lead' }))
  ];
  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const fetchData = async () => {
  try {
    loading.value = true;
    const [inqData, leadData] = await Promise.all([
      inquiryService.getAll(),
      leadService.getAll()
    ]);
    inquiries.value = inqData;
    leads.value = leadData;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData();
  
  // Handle Deep Linking & Highlighting
  const targetId = route.query.id;
  const targetStatus = route.query.status;
  const targetType = route.query.type;

  if (targetStatus === 'pending') {
    // Find first pending item of that type
    const target = combinedList.value.find(i => 
      i.status === 'pending' && 
      (targetType ? i.type.toLowerCase() === targetType : true)
    );
    
    if (target) {
      highlightItem(target._id);
    }
  } else if (targetId) {
    highlightItem(targetId);
  }
});

const highlightItem = async (id) => {
  highlightedId.value = id;
  await nextTick();
  const el = document.getElementById('item-' + id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      highlightedId.value = null;
    }, 3000);
  }
};

const formatDuration = (sec) => {
  if (!sec) return '0m';
  const m = Math.floor(sec / 60);
  return `${m}m browsing`;
};

const updateStatus = async (item, status) => {
  // Senior Design: Optimistic State Update on the source arrays to ensure instant reactivity
  const originalStatus = item.status;
  
  // Find and update in the specific source array for perfect reactivity
  if (item.type === 'Inquiry') {
    const idx = inquiries.value.findIndex(i => i._id === item._id);
    if (idx !== -1) inquiries.value[idx].status = status;
  } else {
    const idx = leads.value.findIndex(l => l._id === item._id);
    if (idx !== -1) leads.value[idx].status = status;
  }

  try {
    if (item.type === 'Inquiry') {
      await inquiryService.updateStatus(item._id, status);
    } else {
      await leadService.updateStatus(item._id, status);
    }
    toast.success(`${item.type} state synchronized`);
  } catch (error) {
    // Revert source state on failure
    if (item.type === 'Inquiry') {
      const idx = inquiries.value.findIndex(i => i._id === item._id);
      if (idx !== -1) inquiries.value[idx].status = originalStatus;
    } else {
      const idx = leads.value.findIndex(l => l._id === item._id);
      if (idx !== -1) leads.value[idx].status = originalStatus;
    }
    toast.error('Synchronization failed - State reverted');
  }
};

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-500 text-white shadow-green-500/20';
  if (status === 'contacted') return 'bg-blue-500 text-white shadow-blue-500/20';
  return 'bg-amber-500 text-white shadow-amber-500/20';
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
};
</script>

<style scoped>
@keyframes pulse-soft {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.01); }
}
.animate-pulse-soft {
  animation: pulse-soft 1s ease-in-out infinite;
}
</style>
