<template>
  <div class="max-w-7xl mx-auto px-6 py-12 md:py-20 relative">
    <LoadingSpinner v-if="loading" overlay />
    
    <div v-if="submitted" class="text-center py-32 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] max-w-2xl mx-auto border border-slate-50">
        <div class="w-24 h-24 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary-900/10">
            <span class="material-icons text-5xl">check_circle</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Order Confirmed!</h1>
        <p class="text-slate-500 mb-12 px-12 text-lg font-medium leading-relaxed">Your luxury selection is being prepared. Our concierge will contact you within 15 minutes to finalize delivery details.</p>
        <router-link to="/" class="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-2xl inline-block">
            Continue Shopping
        </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
      <!-- Checkout Form -->
      <div class="space-y-12">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Secure Checkout</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Shipping Details</h1>
        </div>

        <form @submit.prevent="submitCheckout" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div class="md:col-span-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Delivery Name</label>
            <input v-model="form.fullName" required placeholder="Enter your full name" class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-900 transition-all" />
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Phone</label>
            <input v-model="form.phone" type="tel" required pattern="[0-9]{10}" maxlength="10" minlength="10" placeholder="10-digit number" class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-900 transition-all" />
          </div>


          <div class="md:col-span-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Shipping Address</label>
            <textarea v-model="form.address" required rows="3" placeholder="Flat, Street, Area" class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-900 transition-all resize-none"></textarea>
          </div>

          <div class="md:col-span-2 pt-4">
            <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
              {{ loading ? 'Securing Order...' : 'Confirm Order Inquiry' }}
              <span v-if="!loading" class="material-icons text-lg">verified</span>
            </button>
            <p class="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">Secure 256-bit SSL Encrypted Transaction</p>
          </div>
        </form>
      </div>

      <!-- Order Summary -->
      <div class="lg:sticky lg:top-32 h-fit">
        <div class="bg-slate-900 text-white p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl -mr-32 -mt-32"></div>
          
          <h3 class="text-xl font-black uppercase tracking-widest mb-10 relative z-10 flex items-center gap-3">
            <span class="material-icons text-primary-500">shopping_bag</span>
            Your Luxury Bag
          </h3>
          
          <div class="space-y-8 max-h-[400px] overflow-auto pr-4 mb-10 scrollbar-hide relative z-10">
              <div v-for="item in cartStore.items" :key="item._id" class="flex items-center space-x-6 group">
                  <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img :src="getImageUrl(item.thumbnail)" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div class="flex-grow">
                      <p class="font-black text-sm tracking-tight mb-1 line-clamp-1">{{ item.title }}</p>
                      <p class="text-[10px] text-white/40 uppercase tracking-widest font-bold">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="font-black text-lg tracking-tighter">₹{{ item.finalPrice * item.quantity }}</p>
              </div>
          </div>
          
          <div class="border-t border-white/10 pt-8 space-y-6 relative z-10">
              <div class="flex justify-between items-end">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Total Amount</span>
                    <span class="text-4xl font-black tracking-tighter">₹{{ cartStore.totalAmount }}</span>
                  </div>
                  <div class="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Free Delivery
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../../stores/useCart';
import { inquiryService } from '../../services/api';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const cartStore = useCartStore();
const toast = useToast();
const loading = ref(false);

const submitted = ref(false);
const form = ref({
    fullName: localStorage.getItem('userName') || '',
    phone: localStorage.getItem('userPhone') || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
});

const submitCheckout = async () => {
    if (cartStore.items.length === 0) return toast.error('Your bag is empty');
    if (form.value.phone.length !== 10) return toast.error('10-digit phone number is required');

    try {
        loading.value = true;
        const payload = {
            ...form.value,
            products: cartStore.items.map(i => ({
                product: i._id,
                name: i.title,
                quantity: i.quantity,
                price: i.finalPrice
            })),
            totalAmount: cartStore.totalAmount,
            isAdmin: localStorage.getItem('isAdmin') === 'true'
        };
        
        await inquiryService.create(payload);
        cartStore.clearCart();
        submitted.value = true;
        toast.success('Order inquiry sent successfully!');
    } catch (err) {
    } finally {
        loading.value = false;
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
</style>
