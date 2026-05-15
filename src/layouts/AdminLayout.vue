<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Mobile sidebar backdrop -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>

    <!-- Sidebar -->
    <aside :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition duration-300 ease-in-out md:relative md:translate-x-0']">
      <div class="p-6 text-2xl font-bold border-b border-slate-800 flex justify-between items-center">
        <span>Admin Panel</span>
        <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-white">
          <span class="material-icons">close</span>
        </button>
      </div>
      <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
        <router-link to="/admin" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" exact-active-class="bg-primary-600" @click="isSidebarOpen = false">
          <span class="material-icons">dashboard</span>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600" @click="isSidebarOpen = false">
          <span class="material-icons">inventory_2</span>
          <span>Products</span>
        </router-link>
        <router-link to="/admin/categories" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600" @click="isSidebarOpen = false">
          <span class="material-icons">category</span>
          <span>Categories</span>
        </router-link>
        <router-link to="/admin/banners" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600" @click="isSidebarOpen = false">
          <span class="material-icons">view_carousel</span>
          <span>Banners</span>
        </router-link>
        <router-link to="/admin/leads" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition" active-class="bg-primary-600" @click="isSidebarOpen = false">
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
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile Header -->
      <header class="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-10">
        <div class="text-xl font-bold text-slate-800">Admin Panel</div>
        <button @click="isSidebarOpen = true" class="text-gray-600 hover:text-gray-900 focus:outline-none">
          <span class="material-icons text-3xl">menu</span>
        </button>
      </header>

      <main class="flex-1 overflow-auto p-4 md:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuth';

const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>
