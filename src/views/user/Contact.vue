<template>
  <div class="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full -ml-48 -mb-48 blur-3xl opacity-50"></div>

    <div class="relative z-10">
      <div class="text-center mb-20">
        <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Concierge Desk</span>
        <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none">Personalized Assistance.</h1>
        <p class="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">Whether you're inquiring about a specific selection or need ecosystem support, our dedicated team is at your service.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        <!-- Contact Info Cards -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-primary-500/20 transition-all duration-500 group">
            <div class="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span class="material-icons text-3xl">call</span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-2">Direct Voice</h3>
            <p class="text-slate-500 font-medium mb-6">Our senior advisors are available for immediate consultation.</p>
            <a href="tel:+918208818014" class="text-xl font-black text-primary-600 tracking-tight hover:underline">+91 8208818014</a>
          </div>

          <div class="bg-slate-950 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-2xl -mr-16 -mt-16"></div>
            <div class="w-16 h-16 bg-white/10 backdrop-blur-xl text-white rounded-2xl flex items-center justify-center mb-8">
              <span class="material-icons text-3xl">mail</span>
            </div>
            <h3 class="text-2xl font-black tracking-tight mb-2">Electronic Mail</h3>
            <p class="text-white/40 font-medium mb-6">For detailed inquiries and portfolio collaborations.</p>
            <a href="mailto:support@rizwanstore.com" class="text-xl font-black text-white tracking-tight hover:text-primary-400 transition">support@rizwanstore.com</a>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-3 bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] border border-slate-50 relative">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Signature Name</label>
                <input v-model="form.fullName" required placeholder="John Doe" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Phone</label>
                <input v-model="form.phone" type="tel" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Narrative</label>
              <textarea v-model="form.message" required rows="5" placeholder="How may we assist you today?" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all resize-none"></textarea>
            </div>

            <button type="submit" :disabled="loading" class="w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 transform active:scale-95">
              {{ loading ? 'Transmitting...' : 'Authorize Message' }}
              <span class="material-icons text-lg">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { inquiryService } from '../../services/api';
import { useToast } from '../../composables/useToast';

const toast = useToast();
const loading = ref(false);

const form = ref({
  fullName: localStorage.getItem('userName') || '',
  phone: localStorage.getItem('userPhone') || '',
  message: '',
  type: 'Inquiry'
});

const handleSubmit = async () => {
  if (form.value.phone.length !== 10) {
    return toast.error('10-digit phone number required');
  }

  try {
    loading.value = true;
    await inquiryService.create({
      ...form.value,
      products: [], // Empty for generic inquiry
      totalAmount: 0
    });
    
    toast.success('Your message has been authorized. Expect a response shortly.');
    form.value.message = '';
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>
