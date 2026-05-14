<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-slate-800">
        Admin Panel
      </div>
      <nav class="flex-grow p-4 space-y-2">
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
      <div class="p-4 border-t border-slate-800">
        <button @click="logout" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900 transition text-red-400">
          <span class="material-icons">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow overflow-auto p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>
