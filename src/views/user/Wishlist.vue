<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div class="mb-12">
        <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Personal Collection</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Your Wishlist</h1>
      </div>

      <div v-if="wishlistStore.items.length === 0" class="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div class="w-24 h-24 bg-white text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <span class="material-icons text-5xl">favorite_border</span>
        </div>
        <p class="text-slate-400 font-bold uppercase tracking-widest text-sm mb-10">Your collection is empty</p>
        <router-link to="/products" class="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all shadow-xl inline-block">
          Explore Selection
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in wishlistStore.items" :key="product._id" class="group relative">
           <ProductCard :product="product" />
           <button @click="wishlistStore.toggleWishlist(product)" class="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md text-primary-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10">
             <span class="material-icons text-xl">favorite</span>
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '../../stores/useWishlist';
import ProductCard from '../../components/user/ProductCard.vue';

const wishlistStore = useWishlistStore();
</script>
