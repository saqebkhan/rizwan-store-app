<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
    <!-- Sophisticated Background Elements -->
    <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[100px]"></div>

    <div class="max-w-xl w-full relative z-10">
      <!-- Luxury Branding -->
      <div class="text-center mb-16">
        <div class="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl group transition-transform hover:rotate-6">
          <span class="text-white font-black text-4xl italic">R</span>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tighter mb-4">Authorize Access</h1>
        <p class="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Secure Gateway Protocol</p>
      </div>

      <!-- Premium Login Card -->
      <div class="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-16 border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.5)]">
        <form @submit.prevent="handleLogin" class="space-y-10">
          <div class="space-y-4">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Master Key Phrase</label>
            <div class="relative group">
              <input 
                v-model="password" 
                type="password" 
                required 
                placeholder="••••••••••••"
                class="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2rem] focus:bg-white/10 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-white transition-all outline-none placeholder:text-slate-700"
              />
              <span class="material-icons absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary-500 transition-colors">lock_person</span>
            </div>
          </div>
          
          <Transition name="fade">
            <div v-if="error" class="bg-primary-500/10 border border-primary-500/20 text-primary-500 p-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-3">
              <span class="material-icons text-xl">gpp_maybe</span>
              <span>Authorization Failed: Incorrect Protocol</span>
            </div>
          </Transition>

          <button 
            type="submit" 
            class="w-full bg-white text-slate-950 py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 hover:text-white transition-all transform active:scale-[0.98] flex items-center justify-center space-x-4 shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-primary-600/40"
          >
            <span>Synchronize Session</span>
            <span class="material-icons text-lg">vpn_key</span>
          </button>
        </form>

        <div class="mt-16 text-center">
          <router-link to="/" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2">
            <span class="material-icons text-sm">west</span>
            Exit to Public Storefront
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuth';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const password = ref('');
const error = ref(false);

const handleLogin = () => {
  error.value = false;
  if (authStore.login(password.value)) {
    toast.success('System synchronization successful');
    router.push('/admin');
  } else {
    error.value = true;
    toast.error('Invalid master key');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
