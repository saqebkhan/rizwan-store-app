<template>
  <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
    <!-- Badges -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <span v-if="product.isNewArrival" class="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">New</span>
      <span v-if="product.discountPercentage" class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">-{{ product.discountPercentage }}%</span>
    </div>

    <!-- Image & Info Link -->
    <router-link :to="'/product/' + product.slug" class="block">
      <div class="aspect-square overflow-hidden relative">
        <img 
          :src="imageUrl" 
          :alt="product.title" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <div class="p-4">
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider">{{ product.category?.name || 'Category' }}</p>
        <h3 class="font-semibold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition">{{ product.title }}</h3>
        
        <div class="flex items-center justify-between">
          <div>
            <span class="text-lg font-bold text-gray-900">₹{{ product.finalPrice }}</span>
            <span v-if="product.discountPercentage" class="text-xs text-gray-400 line-through ml-2">₹{{ product.price }}</span>
          </div>
          <button @click.stop.prevent="addToCart" class="bg-primary-50 text-primary-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition relative z-20">
            <span class="material-icons">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </router-link>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../../stores/useCart';

const props = defineProps({
  product: { type: Object, required: true }
});

const cartStore = useCartStore();

const imageUrl = computed(() => {
  return props.product.thumbnail.startsWith('http') 
    ? props.product.thumbnail 
    : `https://rizwan-store-api.onrender.com/uploads/${props.product.thumbnail}`;
});

const addToCart = () => {
  cartStore.addToCart(props.product);
  alert(`${props.product.title} added to cart!`);
};

const addToWishlist = () => {
  // Logic
};
</script>
