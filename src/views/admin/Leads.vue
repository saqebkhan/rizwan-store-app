<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-slate-900">Leads & Inquiries</h1>
      <div class="flex space-x-2">
        <button class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">Export CSV</button>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-gray-100">
          <tr>
            <th class="p-6 font-bold text-slate-600">Customer</th>
            <th class="p-6 font-bold text-slate-600">Order Details</th>
            <th class="p-6 font-bold text-slate-600">Tracking</th>
            <th class="p-6 font-bold text-slate-600">Status</th>
            <th class="p-6 font-bold text-slate-600">Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="inquiry in inquiries" :key="inquiry._id" class="hover:bg-slate-50 transition">
            <td class="p-6">
              <div class="font-bold text-slate-900">{{ inquiry.fullName }}</div>
              <div class="text-sm text-slate-500">{{ inquiry.phone }}</div>
              <div class="text-[10px] text-slate-400 mt-1 uppercase">{{ inquiry.city }}, {{ inquiry.state }}</div>
            </td>
            <td class="p-6">
              <div class="text-sm">
                <span v-for="(p, i) in inquiry.products" :key="i" class="block">
                  {{ p.name }} (x{{ p.quantity }})
                </span>
              </div>
              <div class="mt-2 font-bold text-primary-600">₹{{ inquiry.totalAmount }}</div>
            </td>
            <td class="p-6">
              <div class="flex items-center space-x-2 text-xs text-slate-600">
                <span class="material-icons text-[16px]">timer</span>
                <span>{{ formatDuration(inquiry.sessionDuration) }}</span>
              </div>
              <div class="mt-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                {{ inquiry.source || 'Direct' }}
              </div>
            </td>
            <td class="p-6">
              <select 
                @change="updateStatus(inquiry._id, $event.target.value)" 
                :class="statusClass(inquiry.status)"
                class="text-xs font-bold px-3 py-1 rounded-full outline-none border-none cursor-pointer"
              >
                <option value="pending" :selected="inquiry.status === 'pending'">Pending</option>
                <option value="contacted" :selected="inquiry.status === 'contacted'">Contacted</option>
                <option value="completed" :selected="inquiry.status === 'completed'">Completed</option>
              </select>
            </td>
            <td class="p-6 text-sm text-slate-400">
              {{ new Date(inquiry.createdAt).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const inquiries = ref([]);

const fetchInquiries = async () => {
  const res = await axios.get('http://localhost:5000/api/inquiries');
  inquiries.value = res.data;
};

onMounted(fetchInquiries);

const formatDuration = (sec) => {
  if (!sec) return '0m';
  const m = Math.floor(sec / 60);
  return `${m}m`;
};

const updateStatus = async (id, status) => {
  await axios.patch(`http://localhost:5000/api/inquiries/${id}/status`, { status });
  fetchInquiries();
};

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-700';
  if (status === 'contacted') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
};
</script>
