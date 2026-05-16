<template>
  <div class="flex h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900 overflow-hidden font-medium">
    <!-- Premium Desktop Sidebar -->
    <aside class="hidden lg:flex inset-y-0 left-0 z-50 w-80 bg-slate-950 text-white flex-col transition-all duration-500 relative">
      <!-- Logo Section -->
      <div class="p-10 flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center transition-transform hover:rotate-12">
          <span class="text-slate-950 font-black text-xl italic">R</span>
        </div>
        <span class="text-2xl font-black tracking-tighter">Admin<span class="text-primary-500">Hub</span></span>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow px-6 space-y-3 overflow-y-auto scrollbar-hide">
        <router-link to="/admin" class="flex items-center space-x-4 p-5 rounded-2xl hover:bg-white/5 transition-all group" exact-active-class="bg-white/10 text-white shadow-xl shadow-black/20">
          <span class="material-icons text-slate-500 group-hover:text-primary-500 transition" :class="{'text-primary-500': $route.path === '/admin'}">dashboard</span>
          <span class="text-sm font-black uppercase tracking-widest">Dashboard</span>
        </router-link>
        
        <router-link to="/admin/products" class="flex items-center space-x-4 p-5 rounded-2xl hover:bg-white/5 transition-all group" active-class="bg-white/10 text-white shadow-xl shadow-black/20">
          <span class="material-icons text-slate-500 group-hover:text-primary-500 transition" :class="{'text-primary-500': $route.path.startsWith('/admin/products')}">inventory_2</span>
          <span class="text-sm font-black uppercase tracking-widest">Collections</span>
        </router-link>

        <router-link to="/admin/leads" class="flex items-center space-x-4 p-5 rounded-2xl hover:bg-white/5 transition-all group" active-class="bg-white/10 text-white shadow-xl shadow-black/20">
          <span class="material-icons text-slate-500 group-hover:text-primary-500 transition" :class="{'text-primary-500': $route.path.startsWith('/admin/leads')}">sensors</span>
          <span class="text-sm font-black uppercase tracking-widest">Leads & Orders</span>
        </router-link>

        <router-link to="/admin/categories" class="flex items-center space-x-4 p-5 rounded-2xl hover:bg-white/5 transition-all group" active-class="bg-white/10 text-white shadow-xl shadow-black/20">
          <span class="material-icons text-slate-500 group-hover:text-primary-500 transition" :class="{'text-primary-500': $route.path.startsWith('/admin/categories')}">category</span>
          <span class="text-sm font-black uppercase tracking-widest">Categories</span>
        </router-link>

        <router-link to="/admin/banners" class="flex items-center space-x-4 p-5 rounded-2xl hover:bg-white/5 transition-all group" active-class="bg-white/10 text-white shadow-xl shadow-black/20">
          <span class="material-icons text-slate-500 group-hover:text-primary-500 transition" :class="{'text-primary-500': $route.path.startsWith('/admin/banners')}">view_carousel</span>
          <span class="text-sm font-black uppercase tracking-widest">Banners</span>
        </router-link>
      </nav>

      <!-- Footer Actions -->
      <div class="p-8 space-y-4">
        <!-- Notification Toggle -->
        <button v-if="!isSubscribed" @click="subscribeToNotifications" :disabled="isSubscribing" 
          class="w-full flex items-center space-x-4 p-5 rounded-2xl bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-all border border-primary-500/20 group">
          <span class="material-icons animate-bounce text-xl">{{ isSubscribing ? 'sync' : 'notifications_active' }}</span>
          <span class="text-xs font-black uppercase tracking-widest">{{ isSubscribing ? 'Authorizing...' : 'Live Alerts' }}</span>
        </button>
        <div v-else class="w-full flex items-center space-x-4 p-5 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
          <span class="material-icons text-xl">verified</span>
          <span class="text-xs font-black uppercase tracking-widest">Ecosystem Secure</span>
        </div>

        <button @click="logout" class="w-full flex items-center space-x-4 p-5 rounded-2xl bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 group">
          <span class="material-icons text-xl group-hover:rotate-12 transition">logout</span>
          <span class="text-xs font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>

    <!-- Main Dynamic Canvas -->
    <div class="flex-1 flex flex-col min-w-0 pb-32 lg:pb-0 relative">
      <!-- Mobile Elegant Header -->
      <header class="lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 py-6 z-40 sticky top-0">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center">
            <span class="text-white font-black text-sm italic">R</span>
          </div>
          <span class="text-xl font-black tracking-tighter text-slate-900">Admin<span class="text-primary-600">Hub</span></span>
        </div>
        <div class="flex space-x-4">
          <button @click="logout" class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition">
            <span class="material-icons text-xl">power_settings_new</span>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-auto p-6 md:p-12 scrollbar-hide">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Floating Mobile Bottom Navigation -->
      <div class="lg:hidden fixed bottom-8 left-8 right-8 z-[100]">
        <div class="bg-slate-950/90 backdrop-blur-3xl rounded-[2.5rem] p-3 flex items-center justify-around shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" 
            class="flex flex-col items-center gap-1 p-2 transition-all duration-500"
            :class="$route.path === link.to || ($route.path.startsWith(link.to) && link.to !== '/admin') ? 'text-primary-500 scale-110' : 'text-slate-500 hover:text-white'">
            <span class="material-icons text-2xl">{{ link.icon }}</span>
            <span class="text-[8px] font-black uppercase tracking-tighter">{{ link.label }}</span>
          </router-link>
          
          <!-- Special Action: Notifications on Mobile -->
          <button @click="isSubscribed ? null : subscribeToNotifications()" 
            class="p-4 rounded-[1.5rem] transition-all duration-500"
            :class="isSubscribed ? 'text-green-500' : 'text-amber-500 animate-pulse'">
            <span class="material-icons text-2xl">{{ isSubscribed ? 'verified' : 'notifications_active' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth';
import { notificationService } from '../services/api';
import { useToast } from '../composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isSubscribed = ref(false);
const isSubscribing = ref(false);
let onlineHandler = null;

const navLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dash' },
  { to: '/admin/products', icon: 'inventory_2', label: 'Prods' },
  { to: '/admin/leads', icon: 'sensors', label: 'Leads' },
  { to: '/admin/categories', icon: 'category', label: 'Cats' },
];

const logout = async () => {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await notificationService.unsubscribe(subscription.endpoint);
      }
    }
  } catch (err) {}

  isSubscribed.value = false;
  authStore.logout();
  router.push('/');
  toast.success('Session terminated safely');
};

const checkSubscription = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      isSubscribed.value = true;
      // Re-confirm subscription with backend on every mount (heals stale endpoints)
      try { await notificationService.subscribe(subscription); } catch(e) {}
    }
  }
};

// Flush any notifications missed while offline (e.g., device was off/no internet)
const flushPendingOnReconnect = async () => {
  if (!isSubscribed.value) return;
  try {
    const data = await notificationService.getPending();
    const pending = data?.notifications || [];
    if (pending.length > 0) {
      toast.success(`${pending.length} alert${pending.length > 1 ? 's' : ''} received while offline`);
    }
  } catch (e) {}
};

onMounted(async () => {
  await checkSubscription();
  // Flush any queued alerts from when the admin was offline
  if (navigator.onLine) flushPendingOnReconnect();
  // Listen for reconnection events
  onlineHandler = () => flushPendingOnReconnect();
  window.addEventListener('online', onlineHandler);
});

onUnmounted(() => {
  if (onlineHandler) window.removeEventListener('online', onlineHandler);
});

const subscribeToNotifications = async () => {
  try {
    isSubscribing.value = true;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return toast.error('Browser ecosystem does not support push alerts');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return toast.error('Alert authorization denied');
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Force unsubscribe any old/stale subscription first — this ensures the backend
    // always gets a FRESH endpoint, preventing the "stale subscription" bug
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      await existingSub.unsubscribe();
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    const padding = '='.repeat((4 - vapidPublicKey.length % 4) % 4);
    const base64 = (vapidPublicKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const convertedKey = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) convertedKey[i] = rawData.charCodeAt(i);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });

    await notificationService.subscribe(subscription);
    isSubscribed.value = true;
    toast.success('Live alerts activated — notifications will arrive even when app is closed');
  } catch (error) {
    console.error('[Push subscribe error]', error);
    toast.error('Failed to activate alerts — please try again');
  } finally {
    isSubscribing.value = false;
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

.page-enter-active, .page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
