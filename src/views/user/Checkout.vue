<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="submitted" class="text-center py-20 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-icons text-5xl">check_circle</span>
        </div>
        <h1 class="text-3xl font-bold mb-4">Thank You!</h1>
        <p class="text-gray-500 mb-8 px-8">Your inquiry has been sent to our team. We will contact you shortly on the provided phone number.</p>
        <router-link to="/" class="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-700 transition">
            Continue Shopping
        </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Checkout Form -->
      <div class="space-y-8">
        <h1 class="text-3xl font-bold">Shipping Information</h1>
        <form @submit.prevent="submitCheckout" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="text-sm font-bold text-gray-700">Full Name <span class="text-red-500">*</span></label>
            <input v-model="form.fullName" required class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div>
            <label class="text-sm font-bold text-gray-700">Phone Number <span class="text-red-500">*</span></label>
            <input v-model="form.phone" type="tel" required pattern="[0-9]{10}" maxlength="10" minlength="10" placeholder="10-digit number" class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>


          <div>
            <label class="text-sm font-bold text-gray-700">Alternate Phone</label>
            <input v-model="form.alternatePhone" class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div class="md:col-span-2">
            <label class="text-sm font-bold text-gray-700">Full Address <span class="text-red-500">*</span></label>
            <textarea v-model="form.address" required rows="3" class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
          </div>

          <div>
            <label class="text-sm font-bold text-gray-700">City <span class="text-red-500">*</span></label>
            <input v-model="form.city" required class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div>
            <label class="text-sm font-bold text-gray-700">Pincode <span class="text-red-500">*</span></label>
            <input v-model="form.pincode" required class="w-full mt-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div class="md:col-span-2">
            <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg transform active:scale-[0.98] disabled:opacity-50">
              {{ loading ? 'Processing...' : 'Confirm Order Inquiry' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-100">
        <h3 class="text-xl font-bold mb-6">In Your Bag</h3>
        <div class="space-y-6 max-h-[400px] overflow-auto pr-2 mb-8">
            <div v-for="item in cartStore.items" :key="item._id" class="flex space-x-4">
                <img :src="getImage(item.thumbnail)" class="w-16 h-16 rounded-xl object-cover border border-white" />
                <div class="flex-grow">
                    <p class="font-bold text-sm text-gray-900">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-bold text-sm">₹{{ item.finalPrice * item.quantity }}</p>
            </div>
        </div>
        <div class="border-t border-gray-200 pt-6 space-y-4">
            <div class="flex justify-between text-gray-600">
                <span>Total Amount</span>
                <span class="text-2xl font-bold text-primary-600">₹{{ cartStore.totalAmount }}</span>
            </div>
            <p class="text-[10px] text-center text-gray-400">By confirming, you agree to our Terms of Service.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useCartStore } from '../../stores/useCart';
import { useTrackingStore } from '../../stores/useTracking';

const cartStore = useCartStore();
const trackingStore = useTrackingStore();

const loading = ref(false);
const submitted = ref(false);
const form = ref({
    fullName: localStorage.getItem('userName') || '',
    phone: localStorage.getItem('userPhone') || '',
    alternatePhone: '',
    address: '',
    city: '',
    state: 'Maharashtra', // Default
    pincode: '',
    notes: ''
});

const getImage = (url) => {
  return url.startsWith('http') ? url : `http://localhost:5000/uploads/${url}`;
};

const submitCheckout = async () => {
    if (cartStore.items.length === 0) return alert('Cart is empty');
    if (form.value.phone.length !== 10) return alert('Please enter a valid 10-digit phone number');

    
    loading.value = true;
    try {
        const payload = {
            ...form.value,
            products: cartStore.items.map(i => ({
                product: i._id,
                name: i.title,
                quantity: i.quantity,
                price: i.finalPrice
            })),
            totalAmount: cartStore.totalAmount,
            visitorId: trackingStore.visitorId
        };
        
        await axios.post('http://localhost:5000/api/inquiries', payload);
        cartStore.clearCart();
        submitted.value = true;
    } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
    } finally {
        loading.value = false;
    }
};
</script>
