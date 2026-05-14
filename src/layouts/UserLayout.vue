<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="text-2xl font-bold text-primary-600">RizwanStore</router-link>
      
      <!-- Search Bar -->
      <div class="hidden md:flex flex-1 max-w-lg mx-8 relative">
        <input 
          type="text" 
          placeholder="Search products..." 
          class="w-full bg-white/50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          v-model="searchQuery"
          @input="handleSearch"
          @blur="setTimeout(() => suggestions = [], 200)"
        />
        <!-- Suggestions dropdown -->
        <div v-if="suggestions.length" class="absolute top-full left-0 right-0 bg-white mt-2 rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <router-link 
            v-for="item in suggestions" 
            :key="item._id" 
            :to="'/product/' + item.slug"
            class="flex items-center space-x-4 p-3 hover:bg-gray-50 transition"
          >
            <img :src="'https://rizwan-store-api.onrender.com/uploads/' + item.thumbnail" class="w-10 h-10 rounded-lg object-cover" />
            <span class="text-sm font-medium">{{ item.title }}</span>
          </router-link>
        </div>
      </div>


      <div class="flex items-center space-x-6">
        <router-link to="/wishlist" class="relative">
          <span class="material-icons-outlined text-gray-600">favorite_border</span>
          <span v-if="wishlistCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ wishlistCount }}</span>
        </router-link>
        <router-link to="/cart" class="relative">
          <span class="material-icons-outlined text-gray-600">shopping_cart</span>
          <span v-if="cartCount" class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ cartCount }}</span>
        </router-link>
      <router-link to="/admin-login" class="text-sm font-medium text-gray-500 hover:text-primary-600">Admin</router-link>
      </div>
    </nav>

    <!-- Trust Bar -->
    <div class="bg-primary-50/50 backdrop-blur-sm border-b border-primary-100 py-3 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between whitespace-nowrap space-x-8 animate-scroll md:animate-none overflow-x-auto no-scrollbar">
          <div class="flex items-center space-x-2 shrink-0">
            <span class="material-icons text-primary-600 text-lg">payments</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary-900">Cash on Delivery</span>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <span class="material-icons text-primary-600 text-lg">info</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary-900">No Online Purchase</span>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <span class="material-icons text-primary-600 text-lg">local_shipping</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary-900">Free Delivery</span>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <span class="material-icons text-primary-600 text-lg">history_edu</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary-900">Buy Now Pay Later</span>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <span class="material-icons text-primary-600 text-lg">assignment_return</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary-900">7 Days Return Policy</span>
          </div>
        </div>
      </div>
    </div>


    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12 px-4 mt-20">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold text-white mb-4">RizwanStore</h3>
          <p class="text-sm">Premium products for modern lifestyles. Quality guaranteed.</p>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Categories</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/products?category=electronics">Electronics</router-link></li>
            <li><router-link to="/products?category=fashion">Fashion</router-link></li>
            <li><router-link to="/products?category=home">Home & Living</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Customer Care</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><router-link to="/wishlist">My Wishlist</router-link></li>
            <li><router-link to="/cart">Shopping Cart</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Contact Info</h4>
          <p class="text-sm mb-2">+91 8208818014</p>
          <p class="text-sm mb-4">support@rizwanstore.com</p>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest">Guaranteed 7-day refund policy for all inquiries.</p>
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Navigation -->
    <div class="md:hidden glass fixed bottom-0 left-0 right-0 py-2 px-4 flex justify-between items-center z-50">
      <router-link to="/" class="flex flex-col items-center">
        <span class="material-icons text-gray-600">home</span>
        <span class="text-[10px]">Home</span>
      </router-link>
      <router-link to="/products" class="flex flex-col items-center">
        <span class="material-icons text-gray-600">grid_view</span>
        <span class="text-[10px]">Shop</span>
      </router-link>
      <router-link to="/wishlist" class="flex flex-col items-center">
        <span class="material-icons text-gray-600">favorite_border</span>
        <span class="text-[10px]">Wishlist</span>
      </router-link>
      <router-link to="/cart" class="flex flex-col items-center relative">
        <span class="material-icons text-gray-600">shopping_cart</span>
        <span class="text-[10px]">Cart</span>
        <span v-if="cartCount" class="absolute -top-1 right-0 bg-primary-600 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">{{ cartCount }}</span>
      </router-link>
    </div>

    <!-- Lead Generation Popup (Global) -->
    <div v-if="showPopup" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePopup"></div>
      <div class="bg-white rounded-3xl p-8 max-w-md w-full relative z-[101] shadow-2xl slide-up">
        <button @click="closePopup" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <span class="material-icons">close</span>
        </button>
        <h2 class="text-2xl font-bold mb-2">Welcome to RizwanStore</h2>
        <p class="text-gray-500 mb-6">Get exclusive offers and early access to new arrivals.</p>
        <form @submit.prevent="submitLead" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Full Name</label>
            <input v-model="leadForm.name" type="text" required class="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Phone Number</label>
            <input v-model="leadForm.phone" type="tel" required pattern="[0-9]{10}" maxlength="10" minlength="10" placeholder="10-digit mobile number" class="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-500 transition">
            Start Shopping
          </button>
          <button type="button" @click="closePopup" class="w-full text-gray-400 text-sm font-medium py-2">Skip for now</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../stores/useCart';

const router = useRouter();
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems);
const wishlistCount = ref(0);
const searchQuery = ref('');
const suggestions = ref([]);
let searchTimeout = null;

// Lead Popup Logic
const showPopup = ref(false);
const leadForm = ref({ name: '', phone: '' });
let popupInterval = null;

const checkLead = () => {
  showPopup.value = true;
};

onMounted(() => {
  // Show immediately on landing
  checkLead();
  // Repeatedly show every 3 mins
  popupInterval = setInterval(checkLead, 180000);
});

onUnmounted(() => {
  if (popupInterval) clearInterval(popupInterval);
});

const closePopup = () => {
  showPopup.value = false;
};

const submitLead = async () => {
  if (leadForm.value.phone.length !== 10) {
    return alert('Please enter a valid 10-digit phone number');
  }

  try {
    await axios.post('https://rizwan-store-api.onrender.com/api/leads', leadForm.value);
    localStorage.setItem('userName', leadForm.value.name);
    localStorage.setItem('userPhone', leadForm.value.phone);
    showPopup.value = false;
    // Removed interval clearing to ensure it repeats every 3 mins
    alert('Thank you! Information sent.');
  } catch (err) {
    console.error(err);
    alert('Failed to send inquiry. Please try again.');
  }
};

const handleSearch = () => {

  if (searchTimeout) clearTimeout(searchTimeout);
  
  if (searchQuery.value.length < 2) {
    suggestions.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const res = await axios.get(`https://rizwan-store-api.onrender.com/api/products/suggestions?q=${searchQuery.value}`);
      suggestions.value = res.data;
    } catch (err) {
      console.error(err);
    }
  }, 300);
};

</script>

<style scoped>
.material-icons-outlined, .material-icons {
  font-size: 24px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

