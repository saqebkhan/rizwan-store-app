<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-10">Your Bag</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
      <span class="material-icons text-6xl text-gray-200 mb-4">shopping_bag</span>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
      <router-link to="/products" class="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-6">
        <div v-for="item in cartStore.items" :key="item._id" class="flex items-center space-x-6 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 group">
          <img :src="getImage(item.thumbnail)" class="w-24 h-24 rounded-2xl object-cover" />
          <div class="flex-grow">
            <h3 class="font-bold text-lg group-hover:text-primary-600 transition">{{ item.title }}</h3>
            <p class="text-primary-600 font-bold mt-1">₹{{ item.finalPrice }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex border border-gray-100 rounded-lg overflow-hidden">
                <button @click="cartStore.updateQuantity(item._id, item.quantity - 1)" class="px-3 py-1 hover:bg-gray-50 text-gray-500">-</button>
                <span class="px-3 py-1 font-medium">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item._id, item.quantity + 1)" class="px-3 py-1 hover:bg-gray-50 text-gray-500">+</button>
            </div>
            <button @click="cartStore.removeFromCart(item._id)" class="text-gray-400 hover:text-red-500 transition">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="space-y-6">
        <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <h3 class="text-xl font-bold mb-6">Order Summary</h3>
          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>₹{{ cartStore.totalAmount }}</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span class="text-green-400">Free</span>
            </div>
            <div class="h-px bg-slate-800 my-4"></div>
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{{ cartStore.totalAmount }}</span>
            </div>
          </div>
          <router-link to="/checkout" class="block w-full bg-white text-slate-900 text-center py-4 rounded-xl font-bold hover:bg-primary-50 transition transform active:scale-95">
            Proceed to Checkout
          </router-link>
        </div>
        <router-link to="/products" class="flex items-center justify-center space-x-2 text-gray-500 hover:text-primary-600 font-medium transition">
          <span class="material-icons text-sm">arrow_back</span>
          <span>Continue Shopping</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/useCart';

const cartStore = useCartStore();

const getImage = (url) => {
  return url.startsWith('http') ? url : `https://rizwan-store-api.onrender.com/uploads/${url}`;
};
</script>
