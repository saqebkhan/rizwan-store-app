<template>
  <div class="min-h-screen flex flex-col relative bg-white selection:bg-primary-100 selection:text-primary-900">
    <LoadingSpinner v-if="loading" overlay />
    
    <!-- Global Sticky Header -->
    <header class="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
      <!-- Premium Navigation (Top) -->
      <nav class="bg-white/90 backdrop-blur-xl px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <router-link to="/" class="group flex items-center space-x-2">
            <div class="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <span class="text-white font-black text-xl italic">R</span>
            </div>
            <span class="text-2xl font-black text-slate-900 tracking-tighter">Rizwan<span class="text-primary-600">Store</span></span>
          </router-link>
          
          <!-- Desktop Search Bar -->
          <div class="hidden lg:flex flex-1 max-w-xl mx-12 relative group">
            <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span class="material-icons text-slate-400 text-xl group-focus-within:text-primary-600 transition">search</span>
            </div>
            <input 
              type="text" 
              placeholder="Search our luxury collection..." 
              class="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] pl-14 pr-6 py-3.5 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-900"
              v-model="searchQuery"
              @input="handleSearch"
              @blur="setTimeout(() => suggestions = [], 200)"
            />
            <!-- Suggestions dropdown -->
            <Transition name="fade">
              <div v-if="suggestions.length" class="absolute top-full left-0 right-0 bg-white mt-4 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 p-2">
                <router-link 
                  v-for="item in suggestions" 
                  :key="item._id" 
                  :to="'/product/' + item.slug"
                  class="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-[1.25rem] transition group"
                >
                  <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                    <img :src="getImageUrl(item.thumbnail)" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-slate-900">{{ item.title }}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ item.category?.name }}</p>
                  </div>
                  <div class="ml-auto pr-2">
                    <span class="text-slate-900 font-black text-xs">₹{{ item.finalPrice }}</span>
                  </div>
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- Action Icons -->
          <div class="flex items-center space-x-8">
            <router-link to="/cart" class="group relative flex items-center space-x-2">
              <div class="relative">
                <span class="material-icons text-slate-400 group-hover:text-slate-900 transition">shopping_bag</span>
                <span v-if="cartCount" class="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-primary-600/20">{{ cartCount }}</span>
              </div>
              <span class="hidden md:block text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition">Bag</span>
            </router-link>
            
            <router-link v-if="!isAdmin" to="/admin-login" class="bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2.5 rounded-xl transition">
              <span class="material-icons text-xl">admin_panel_settings</span>
            </router-link>
            <router-link v-else to="/admin" class="bg-primary-50 text-primary-600 p-2.5 rounded-xl transition">
              <span class="material-icons text-xl">dashboard</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Trust Ticker (Below Navbar) -->
      <div class="bg-slate-950 py-2.5 overflow-hidden">
        <div class="flex items-center justify-center whitespace-nowrap space-x-12 animate-scroll">
          <div v-for="i in 2" :key="i" class="flex items-center space-x-12 shrink-0">
            <div class="flex items-center space-x-3">
              <span class="material-icons text-primary-500 text-sm">verified</span>
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">All Product Cash On Delivery</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="material-icons text-primary-500 text-sm">local_shipping</span>
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">All Product Free Delivery</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="material-icons text-primary-500 text-sm">payments</span>
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">You Checkout We Deliver</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="material-icons text-primary-500 text-sm">assignment_return</span>
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">All Product 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Premium Footer -->
    <footer class="bg-slate-950 text-white pt-24 pb-32 md:pb-12 px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
        <div>
          <router-link to="/" class="flex items-center space-x-2 mb-8">
            <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <span class="text-slate-950 font-black text-sm italic">R</span>
            </div>
            <span class="text-xl font-black tracking-tighter">Rizwan<span class="text-primary-500">Store</span></span>
          </router-link>
          <p class="text-slate-400 text-sm font-medium leading-relaxed mb-8">Curating the world's finest minimal essentials for the modern pioneer. Redefining quality since 2024.</p>
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition"><span class="material-icons text-lg">public</span></a>
            <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition"><span class="material-icons text-lg">facebook</span></a>
            <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition"><span class="material-icons text-lg">alternate_email</span></a>
          </div>
        </div>
        
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.3em] mb-10 text-primary-500">Shop Collections</h4>
          <ul class="space-y-4">
            <li><router-link to="/products" class="text-slate-400 hover:text-white transition text-sm font-bold">New Arrivals</router-link></li>
            <li><router-link to="/products" class="text-slate-400 hover:text-white transition text-sm font-bold">Best Sellers</router-link></li>
            <li><router-link to="/products" class="text-slate-400 hover:text-white transition text-sm font-bold">Electronics</router-link></li>
            <li><router-link to="/products" class="text-slate-400 hover:text-white transition text-sm font-bold">Premium Fashion</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.3em] mb-10 text-primary-500">Customer Concierge</h4>
          <ul class="space-y-4">
            <li><router-link to="/contact" class="text-slate-400 hover:text-white transition text-sm font-bold">Contact Us</router-link></li>
            <li><router-link to="/cart" class="text-slate-400 hover:text-white transition text-sm font-bold">Shipping Info</router-link></li>
            <li><router-link to="/checkout" class="text-slate-400 hover:text-white transition text-sm font-bold">Track Order</router-link></li>
            <li><router-link to="/" class="text-slate-400 hover:text-white transition text-sm font-bold">Refund Policy</router-link></li>
          </ul>
        </div>

        <div class="bg-white/5 p-8 rounded-[2rem] border border-white/10">
          <h4 class="text-xs font-black uppercase tracking-[0.3em] mb-6 text-white">Direct Connect</h4>
          <p class="text-2xl font-black text-white mb-2">+91 8208818014</p>
          <p class="text-slate-400 text-xs font-bold mb-8">Available 24/7 For You</p>
          <button class="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-500 hover:text-white transition-all">Support Center</button>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">© 2024 RizwanStore International. All rights reserved.</p>
        <div class="flex space-x-8">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Privacy</span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Terms</span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Cookies</span>
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Navigation (Floating) -->
    <div class="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <div class="bg-slate-950/90 backdrop-blur-2xl rounded-3xl p-2.5 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <router-link to="/" class="flex flex-col items-center gap-1 p-2 transition-all duration-500" :class="route.path === '/' ? 'text-primary-500' : 'text-slate-400 hover:text-white'">
          <span class="material-icons">home</span>
          <span class="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </router-link>
        <router-link to="/products" class="flex flex-col items-center gap-1 p-2 transition-all duration-500" :class="route.path === '/products' ? 'text-primary-500' : 'text-slate-400 hover:text-white'">
          <span class="material-icons">grid_view</span>
          <span class="text-[8px] font-black uppercase tracking-tighter">Store</span>
        </router-link>
        <router-link to="/cart" class="flex flex-col items-center gap-1 p-2 transition-all duration-500 relative" :class="route.path === '/cart' ? 'text-primary-500' : 'text-slate-400 hover:text-white'">
          <span class="material-icons">shopping_bag</span>
          <span v-if="cartCount" class="absolute top-1 right-1 bg-white text-slate-950 text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{{ cartCount }}</span>
          <span class="text-[8px] font-black uppercase tracking-tighter">Bag</span>
        </router-link>
        <router-link to="/wishlist" class="flex flex-col items-center gap-1 p-2 transition-all duration-500 relative" :class="route.path === '/wishlist' ? 'text-primary-500' : 'text-slate-400 hover:text-white'">
          <span class="material-icons">favorite</span>
          <span v-if="wishlistCount" class="absolute top-1 right-1 bg-white text-slate-950 text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{{ wishlistCount }}</span>
          <span class="text-[8px] font-black uppercase tracking-tighter">Wishlist</span>
        </router-link>
      </div>
    </div>

    <!-- Lead Generation Popup (Redesigned) -->
    <Transition name="scale">
      <div v-if="showPopup" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" @click="closePopup"></div>
        <div class="bg-white rounded-[3rem] p-10 md:p-12 max-w-xl w-full relative z-[201] shadow-[0_50px_150px_rgba(0,0,0,0.5)] overflow-hidden">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-primary-50 rounded-full -mr-24 -mt-24"></div>
          
          <button @click="closePopup" class="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition">
            <span class="material-icons text-3xl">close</span>
          </button>

          <div class="relative z-10">
            <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Exclusive Access</span>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-none">Join The Inner Circle <span class="text-primary-600">FREE.</span></h2>
            <p class="text-slate-500 mb-10 text-lg font-medium leading-relaxed">Unlock early drops, secret collections, and a welcome gift on your first selection.</p>
            
            <form @submit.prevent="submitLead" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input v-model="leadForm.name" type="text" required placeholder="John Doe" class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-900" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input v-model="leadForm.phone" type="tel" required pattern="[0-9]{10}" maxlength="10" minlength="10" placeholder="10-digit mobile" class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-900" />
              </div>

              <div class="pt-4 flex flex-col gap-4">
                <button type="submit" class="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-2xl shadow-primary-900/20 active:scale-[0.98]">
                  Claim My Access
                </button>
                <button type="button" @click="closePopup" class="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-slate-900 transition">Maybe later, I'll browse first</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { leadService, productService } from '../services/api';
import { useToast } from '../composables/useToast';
import { useCartStore } from '../stores/useCart';
import { useWishlistStore } from '../stores/useWishlist';
import { useAuthStore } from '../stores/useAuth';
import { getImageUrl } from '../utils/image';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();

const cartCount = computed(() => cartStore.totalItems);
const wishlistCount = computed(() => wishlistStore.totalItems);
const isAdmin = computed(() => authStore.isAdmin);
const loading = ref(false);

const searchQuery = ref('');
const suggestions = ref([]);
let searchTimeout = null;

// Lead Popup Logic
const showPopup = ref(false);
const leadForm = ref({ name: '', phone: '' });
let popupInterval = null;

onMounted(() => {
  // Show immediately for every visitor on landing if not already submitted in session
  const hasSubmitted = sessionStorage.getItem('leadSubmitted');
  
  if (!authStore.isAdmin && !hasSubmitted) {
    setTimeout(() => {
      showPopup.value = true;
    }, 1500);
  }
  
  // Repeatedly show every 2 mins for visitors who haven't submitted
  popupInterval = setInterval(() => {
    if (!showPopup.value && !authStore.isAdmin && !sessionStorage.getItem('leadSubmitted')) {
      showPopup.value = true;
    }
  }, 120000);
});

onUnmounted(() => {
  if (popupInterval) clearInterval(popupInterval);
});

const closePopup = () => {
  showPopup.value = false;
};

const submitLead = async () => {
  if (leadForm.value.phone.length !== 10) {
    return toast.error('10-digit phone number is required');
  }

  try {
    loading.value = true;
    await leadService.create(leadForm.value);
    localStorage.setItem('userName', leadForm.value.name);
    localStorage.setItem('userPhone', leadForm.value.phone);
    sessionStorage.setItem('leadSubmitted', 'true');
    showPopup.value = false;
    toast.success('Welcome to the Inner Circle!');
  } catch (err) {
  } finally {
    loading.value = false;
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
      const data = await productService.getSuggestions(searchQuery.value);
      suggestions.value = data;
    } catch (err) {}
  }, 300);
};
</script>

<style scoped>
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-scroll {
  animation: scroll 20s linear infinite;
}
.animate-scroll:hover {
  animation-play-state: paused;
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

.scale-enter-active, .scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

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

