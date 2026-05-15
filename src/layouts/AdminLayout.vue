<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Desktop Sidebar (Hidden on Mobile) -->
    <aside class="hidden md:flex inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex-col transition duration-300 ease-in-out relative translate-x-0">
      <div class="p-6 text-2xl font-bold border-b border-slate-800 flex justify-between items-center">
        <span>Admin Panel</span>
      </div>
      <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
        <router-link to="/admin" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" exact-active-class="bg-primary-600">
          <span class="material-icons">dashboard</span>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600">
          <span class="material-icons">inventory_2</span>
          <span>Products</span>
        </router-link>
        <router-link to="/admin/categories" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600">
          <span class="material-icons">category</span>
          <span>Categories</span>
        </router-link>
        <router-link to="/admin/banners" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600">
          <span class="material-icons">view_carousel</span>
          <span>Banners</span>
        </router-link>
        <router-link to="/admin/leads" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600">
          <span class="material-icons">people</span>
          <span>Leads & Inquiries</span>
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-800 space-y-2">
        <button v-if="!isSubscribed" @click="subscribeToNotifications" :disabled="isSubscribing" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition text-amber-400">
          <span class="material-icons">notifications_active</span>
          <span>{{ isSubscribing ? 'Enabling...' : 'Enable Notifications' }}</span>
        </button>
        <button v-else disabled class="w-full flex items-center space-x-3 p-3 rounded-lg text-green-400 opacity-80 cursor-default">
          <span class="material-icons">check_circle</span>
          <span>Notifications Enabled</span>
        </button>

        <button @click="logout" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900 transition text-red-400">
          <span class="material-icons">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 relative">
      <!-- Mobile Header -->
      <header class="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-10 sticky top-0">
        <div class="text-xl font-bold text-slate-800">Admin Panel</div>
        <div class="flex space-x-4">
          <button v-if="!isSubscribed" @click="subscribeToNotifications" class="text-amber-500 hover:text-amber-600 focus:outline-none">
            <span class="material-icons text-2xl">notifications_active</span>
          </button>
          <button v-else class="text-green-500 opacity-80 cursor-default focus:outline-none">
            <span class="material-icons text-2xl">check_circle</span>
          </button>
          <button @click="logout" class="text-red-500 hover:text-red-600 focus:outline-none">
            <span class="material-icons text-2xl">logout</span>
          </button>
        </div>
      </header>

      <!-- Main Area -->
      <main class="flex-1 overflow-auto p-4 md:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Mobile Bottom Navigation Bar -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <div class="flex justify-around items-center h-16">
          <router-link to="/admin" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary-600 transition" exact-active-class="text-primary-600">
            <span class="material-icons text-2xl">dashboard</span>
            <span class="text-[10px] mt-1 font-medium">Dash</span>
          </router-link>
          <router-link to="/admin/products" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary-600 transition" active-class="text-primary-600">
            <span class="material-icons text-2xl">inventory_2</span>
            <span class="text-[10px] mt-1 font-medium">Prods</span>
          </router-link>
          <router-link to="/admin/categories" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary-600 transition" active-class="text-primary-600">
            <span class="material-icons text-2xl">category</span>
            <span class="text-[10px] mt-1 font-medium">Cats</span>
          </router-link>
          <router-link to="/admin/banners" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary-600 transition" active-class="text-primary-600">
            <span class="material-icons text-2xl">view_carousel</span>
            <span class="text-[10px] mt-1 font-medium">Banners</span>
          </router-link>
          <router-link to="/admin/leads" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-primary-600 transition" active-class="text-primary-600">
            <span class="material-icons text-2xl">people</span>
            <span class="text-[10px] mt-1 font-medium">Leads</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);
const isSubscribed = ref(false);
const isSubscribing = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/');
};

// Web Push Notification Logic
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const checkSubscription = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      isSubscribed.value = true;
    }
  }
};

onMounted(() => {
  checkSubscription();
});

const subscribeToNotifications = async () => {
  try {
    isSubscribing.value = true;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported by this browser.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Notification permission denied.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // Send subscription to backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await axios.post(`${API_URL}/api/notifications/subscribe`, subscription);
    
    isSubscribed.value = true;
    alert('Notifications enabled successfully!');
  } catch (error) {
    console.error('Failed to subscribe:', error);
    alert('Failed to enable notifications.');
  } finally {
    isSubscribing.value = false;
  }
};
</script>
