<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else class="space-y-8">
    <LoadingSpinner :show="isSaving" overlay />
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 class="text-3xl font-bold text-slate-900">Leads & Inquiries</h1>
      <div class="flex space-x-2 w-full md:w-auto">
        <button class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium hover:bg-gray-50 transition w-full md:w-auto">Export CSV</button>
      </div>
    </div>

    <div class="bg-white md:rounded-3xl shadow-sm border-y md:border border-gray-100 overflow-hidden">
      <!-- Mobile-First Table Layout -->
      <table class="w-full text-left block md:table">
        <thead class="bg-slate-50 border-b border-gray-100 hidden md:table-header-group">
          <tr>
            <th class="p-6 font-bold text-slate-600">Type</th>
            <th class="p-6 font-bold text-slate-600">Customer</th>
            <th class="p-6 font-bold text-slate-600">Details</th>
            <th class="p-6 font-bold text-slate-600">Tracking / Time</th>
            <th class="p-6 font-bold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50 block md:table-row-group">
          <tr v-for="item in combinedList" :key="item._id" class="block md:table-row hover:bg-slate-50 transition p-4 md:p-0">
            <!-- Type Badge -->
            <td class="p-2 md:p-6 block md:table-cell">
              <span v-if="item.type === 'Inquiry'" class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Checkout</span>
              <span v-else class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Popup Lead</span>
            </td>
            <!-- Customer -->
            <td class="p-2 md:p-6 block md:table-cell">
              <div class="font-bold text-slate-900">{{ item.fullName || item.name }}</div>
              <div class="text-sm text-slate-500">{{ item.phone }}</div>
              <div v-if="item.city" class="text-[10px] text-slate-400 mt-1 uppercase">{{ item.city }}, {{ item.state }}</div>
            </td>
            <!-- Details -->
            <td class="p-2 md:p-6 block md:table-cell">
              <div v-if="item.type === 'Inquiry'">
                <div class="text-sm">
                  <span v-for="(p, i) in item.products" :key="i" class="block">
                    {{ p.name }} (x{{ p.quantity }})
                  </span>
                </div>
                <div class="mt-2 font-bold text-primary-600">₹{{ item.totalAmount }}</div>
              </div>
              <div v-else class="text-sm text-slate-500">
                Awaiting contact
              </div>
            </td>
            <!-- Tracking & Time -->
            <td class="p-2 md:p-6 block md:table-cell">
              <div v-if="item.sessionDuration" class="flex items-center space-x-2 text-xs text-slate-600 mb-1">
                <span class="material-icons text-[16px]">timer</span>
                <span>{{ formatDuration(item.sessionDuration) }}</span>
              </div>
              <div class="text-xs text-slate-400">
                {{ new Date(item.createdAt).toLocaleString() }}
              </div>
              <div class="mt-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                {{ item.source || 'Direct' }}
              </div>
            </td>
            <!-- Status -->
            <td class="p-2 md:p-6 block md:table-cell">
              <select v-if="item.type === 'Inquiry'"
                @change="updateStatus(item._id, $event.target.value)" 
                :class="statusClass(item.status)"
                class="text-xs font-bold px-3 py-1 rounded-full outline-none border-none cursor-pointer"
              >
                <option value="pending" :selected="item.status === 'pending'">Pending</option>
                <option value="contacted" :selected="item.status === 'contacted'">Contacted</option>
                <option value="completed" :selected="item.status === 'completed'">Completed</option>
              </select>
              <span v-else class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                Lead
              </span>
            </td>
          </tr>
          <tr v-if="combinedList.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-400">No leads or inquiries yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const isLoading = ref(false);
const isSaving = ref(false);

const inquiries = ref([]);
const leads = ref([]);

const combinedList = computed(() => {
  const merged = [
    ...inquiries.value.map(i => ({ ...i, type: 'Inquiry' })),
    ...leads.value.map(l => ({ ...l, type: 'Lead' }))
  ];
  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [inqRes, leadRes] = await Promise.all([
      axios.get(`${API_URL}/api/inquiries`),
      axios.get(`${API_URL}/api/leads`)
    ]);
    inquiries.value = inqRes.data;
    leads.value = leadRes.data;
  } catch (error) {
    console.error(error);
    alert('Failed to load data.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

const formatDuration = (sec) => {
  if (!sec) return '0m';
  const m = Math.floor(sec / 60);
  return `${m}m`;
};

const updateStatus = async (id, status) => {
  try {
    isSaving.value = true;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await axios.patch(`${API_URL}/api/inquiries/${id}/status`, { status });
    await fetchData();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to update status.');
  } finally {
    isSaving.value = false;
  }
};

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-700';
  if (status === 'contacted') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};
</script>
