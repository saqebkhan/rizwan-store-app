<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-primary-600 text-3xl">admin_panel_settings</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Admin Portal</h1>
        <p class="text-gray-500">Enter your credentials to access the dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition"
          />
        </div>
        
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center space-x-2">
          <span class="material-icons text-sm">error</span>
          <span>{{ error }}</span>
        </div>

        <button 
          type="submit" 
          class="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>Login to Dashboard</span>
          <span class="material-icons text-sm">arrow_forward</span>
        </button>
      </form>

      <div class="mt-8 text-center">
        <router-link to="/" class="text-sm text-gray-400 hover:text-primary-600 transition">Back to User Store</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuth';

const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const error = ref('');

const handleLogin = () => {
  error.value = '';
  if (authStore.login(password.value)) {
    router.push('/admin');
  } else {
    error.value = 'Invalid password. Please try again.';
  }
};
</script>
