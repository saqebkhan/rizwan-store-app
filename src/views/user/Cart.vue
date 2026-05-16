<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
    <div class="mb-8 lg:mb-12">
      <h1 class="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">Your Bag</h1>
      <p class="text-xs text-slate-400 uppercase tracking-widest font-bold" v-if="cartStore.items.length > 0">{{ cartStore.items.length }} Items in cart</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
      <span class="material-icons text-6xl text-slate-200 mb-6">shopping_bag</span>
      <h2 class="text-xl font-black text-slate-900 mb-2">Your cart is empty</h2>
      <p class="text-slate-500 mb-8 font-medium">Looks like you haven't added anything yet.</p>
      <router-link to="/products" class="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl hover:shadow-primary-600/20 hover:-translate-y-1">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-4 lg:space-y-6">
        <div v-for="item in cartStore.items" :key="item._id" class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 lg:p-6 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group relative transition-all hover:border-slate-200">
          <div class="flex items-center gap-4 sm:gap-6 flex-grow">
            <router-link :to="'/product/' + item.slug" class="flex-shrink-0">
              <img :src="getImageUrl(item.thumbnail)" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-50" />
            </router-link>
            <div class="flex-grow">
              <p class="text-[10px] text-primary-600 font-bold uppercase tracking-widest mb-1">{{ item.category?.name || 'Product' }}</p>
              <router-link :to="'/product/' + item.slug">
                <h3 class="font-black text-slate-900 leading-tight line-clamp-2 text-sm sm:text-base hover:text-primary-600 transition">{{ item.title }}</h3>
              </router-link>
              <p class="text-slate-900 font-black mt-2 text-sm sm:text-lg">₹{{ item.finalPrice }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
            <div class="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button @click="cartStore.updateQuantity(item._id, item.quantity - 1)" class="px-4 py-2 hover:bg-white text-slate-600 transition active:bg-slate-200">-</button>
                <span class="px-4 py-2 font-black text-sm bg-white border-x border-slate-200 min-w-[3rem] text-center">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item._id, item.quantity + 1)" class="px-4 py-2 hover:bg-white text-slate-600 transition active:bg-slate-200">+</button>
            </div>
            <button @click="cartStore.removeFromCart(item._id)" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 sm:p-3 rounded-xl transition flex items-center justify-center">
              <span class="material-icons sm:text-xl">delete_outline</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="bg-slate-950 text-white p-6 lg:p-8 rounded-[2rem] shadow-2xl">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-4">Order Summary</h3>
          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-slate-300 font-medium text-sm">
              <span>Subtotal</span>
              <span>₹{{ cartStore.totalAmount }}</span>
            </div>
            <div class="flex justify-between text-slate-300 font-medium text-sm">
              <span>Shipping</span>
              <span class="text-primary-500 font-bold tracking-widest uppercase text-xs">Free</span>
            </div>
            <div class="h-px bg-slate-800 my-4"></div>
            <div class="flex justify-between text-xl lg:text-2xl font-black">
              <span>Total</span>
              <span class="text-primary-500">₹{{ cartStore.totalAmount }}</span>
            </div>
          </div>
          <router-link to="/checkout" class="block w-full bg-white text-slate-900 text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95">
            Proceed to Checkout
          </router-link>
        </div>
        <router-link to="/products" class="flex items-center justify-center space-x-2 text-slate-500 hover:text-primary-600 font-black text-xs uppercase tracking-widest transition group">
          <span class="material-icons text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span>Continue Shopping</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/useCart';

import { getImageUrl } from '../../utils/image';

const cartStore = useCartStore();
</script>
