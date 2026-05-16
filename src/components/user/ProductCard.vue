<template>
  <div class="group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative h-full flex flex-col">
    <!-- Badges -->
    <div class="absolute top-3 left-3 lg:top-4 lg:left-4 z-10 flex flex-col gap-1.5 lg:gap-2">
      <span v-if="product.isNewArrival" class="bg-slate-900 text-white text-[8px] lg:text-[10px] font-black px-2 lg:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">New</span>
      <span v-if="product.discountPercentage" class="bg-primary-500 text-white text-[8px] lg:text-[10px] font-black px-2 lg:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">-{{ product.discountPercentage }}%</span>
    </div>

    <!-- Image Section -->
    <router-link :to="'/product/' + product.slug" class="block relative overflow-hidden aspect-[4/5]">
      <img 
        :src="getImageUrl(product.thumbnail)" 
        :alt="product.title" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      
      <!-- Quick Add (Desktop only hover) -->
      <button 
        @click.stop.prevent="addToCart" 
        class="hidden lg:block absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-primary-600 hover:text-white"
      >
        Quick Add
      </button>
    </router-link>
    
    <!-- Info Section -->
    <div class="p-4 lg:p-6 flex flex-col flex-1">
      <div class="mb-3 lg:mb-4">
        <p class="text-[8px] lg:text-[10px] text-primary-600 font-bold uppercase tracking-[0.2em] mb-1 truncate">{{ product.category?.name || 'Collection' }}</p>
        <router-link :to="'/product/' + product.slug">
          <h3 class="font-black text-slate-900 leading-tight line-clamp-2 hover:text-primary-600 transition tracking-tight text-xs sm:text-sm md:text-base">{{ product.title }}</h3>
        </router-link>
      </div>
      
      <div class="mt-auto flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-sm sm:text-base lg:text-xl font-black text-slate-900">₹{{ product.finalPrice }}</span>
          <span v-if="product.discountPercentage" class="text-[10px] lg:text-xs text-slate-400 line-through">₹{{ product.price }}</span>
        </div>
        
        <!-- Mobile Cart Button -->
        <button @click.stop.prevent="addToCart" class="lg:hidden bg-slate-900 text-white p-2 sm:p-2.5 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg active:scale-95 transition">
          <span class="material-icons text-base sm:text-sm lg:text-xl">add_shopping_cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/useCart';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';

const props = defineProps({
  product: { type: Object, required: true }
});

const cartStore = useCartStore();
const toast = useToast();

const addToCart = () => {
  cartStore.addToCart(props.product);
  toast.success(`Added ${props.product.title} to your bag`);
};
</script>
