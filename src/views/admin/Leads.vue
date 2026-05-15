<template>
  <div class="space-y-12 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Conversion Hub</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Active Interests</h1>
        </div>
        <div class="flex space-x-3">
          <button class="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl">
            Export Ecosystem Data
          </button>
        </div>
      </header>

      <!-- Combined List -->
      <div class="grid grid-cols-1 gap-6">
        <div v-for="item in combinedList" :key="item._id" 
          class="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-500 group">
          <div class="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <!-- Type & Customer Info -->
            <div class="flex items-start space-x-6">
              <div class="w-20 h-20 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-inner"
                :class="item.type === 'Inquiry' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'">
                <span class="material-icons text-3xl">{{ item.type === 'Inquiry' ? 'shopping_bag' : 'sensors' }}</span>
              </div>
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm"
                    :class="item.type === 'Inquiry' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'">
                    {{ item.type === 'Inquiry' ? 'Order Inquiry' : 'Instant Lead' }}
                  </span>
                  <span class="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{{ timeAgo(item.createdAt) }}</span>
                </div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-1">{{ item.fullName || item.name }}</h3>
                <div class="flex items-center space-x-4">
                  <a :href="'tel:' + item.phone" class="text-sm font-bold text-slate-500 hover:text-primary-600 transition flex items-center gap-1">
                    <span class="material-icons text-sm">call</span>
                    {{ item.phone }}
                  </a>
                  <span v-if="item.city" class="text-[10px] text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span class="material-icons text-xs">location_on</span>
                    {{ item.city }}, {{ item.state }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detail Section -->
            <div class="flex-1 max-w-md">
              <div v-if="item.type === 'Inquiry'" class="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Inquiry Selection</span>
                  <span class="text-primary-600">₹{{ item.totalAmount }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(p, i) in item.products" :key="i" class="text-[10px] font-black text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    {{ p.name }} <span class="text-slate-300 ml-1">×{{ p.quantity }}</span>
                  </span>
                </div>
              </div>
              <div v-else class="flex items-center space-x-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  <span class="material-icons text-xl">contact_support</span>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-900 tracking-tight">Express Interest Captured</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting Initial Contact</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
              <div v-if="item.sessionDuration" class="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl">
                <span class="material-icons text-xs">timer</span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ formatDuration(item.sessionDuration) }}</span>
              </div>
              
              <select v-if="item.type === 'Inquiry'"
                @change="updateStatus(item._id, $event.target.value)" 
                :class="statusClass(item.status)"
                class="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl outline-none border-none cursor-pointer shadow-lg transition-all active:scale-95"
              >
                <option value="pending" :selected="item.status === 'pending'">Pending</option>
                <option value="contacted" :selected="item.status === 'contacted'">Contacted</option>
                <option value="completed" :selected="item.status === 'completed'">Completed</option>
              </select>
              <div v-else class="bg-slate-100 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                New Prospect
              </div>
            </div>

          </div>
        </div>
        
        <div v-if="combinedList.length === 0" class="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <span class="material-icons text-7xl text-slate-200 mb-6">dynamic_feed</span>
          <p class="text-slate-400 font-black uppercase tracking-widest text-sm">No activity recorded yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { inquiryService, leadService } from '../../services/api';
import { useToast } from '../../composables/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const toast = useToast();
const inquiries = ref([]);
const leads = ref([]);
const loading = ref(false);

const combinedList = computed(() => {
  const merged = [
    ...inquiries.value.map(i => ({ ...i, type: 'Inquiry' })),
    ...leads.value.map(l => ({ ...l, type: 'Lead' }))
  ];
  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const fetchData = async () => {
  try {
    const [inqData, leadData] = await Promise.all([
      inquiryService.getAll(),
      leadService.getAll()
    ]);
    inquiries.value = inqData;
    leads.value = leadData;
  } catch (error) {}
};

onMounted(fetchData);

const formatDuration = (sec) => {
  if (!sec) return '0m';
  const m = Math.floor(sec / 60);
  return `${m} mins browsing`;
};

const updateStatus = async (id, status) => {
  try {
    await inquiryService.updateStatus(id, status);
    toast.success('Status synchronized successfully');
    await fetchData();
  } catch (error) {}
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
