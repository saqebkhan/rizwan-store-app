<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <div class="aspect-square rounded-3xl overflow-hidden glass group cursor-zoom-in">
          <img :src="getImage(activeImage)" loading="lazy" class="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
        </div>
        <div class="flex space-x-4">
          <button 
            v-for="img in allImages" 
            :key="img" 
            @click="activeImage = img"
            :class="activeImage === img ? 'ring-2 ring-primary-600' : 'opacity-60'"
            class="w-20 h-20 rounded-xl overflow-hidden transition"
          >
            <img :src="getImage(img)" loading="lazy" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="space-y-8">
        <div>
          <nav class="flex text-sm text-gray-400 mb-4 space-x-2">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <router-link to="/products">Products</router-link>
            <span>/</span>
            <span class="text-gray-900">{{ product.title }}</span>
          </nav>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
          <p class="text-gray-500 uppercase text-xs tracking-widest">{{ product.category?.name }}</p>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold text-primary-600">₹{{ product.finalPrice }}</span>
          <span v-if="product.discountPercentage" class="text-xl text-gray-400 line-through">₹{{ product.price }}</span>
          <span v-if="product.discountPercentage" class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">{{ product.discountPercentage }}% OFF</span>
        </div>

        <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

        <div class="space-y-4 pt-6">
          <div class="flex items-center space-x-4">
            <div class="flex border border-gray-200 rounded-xl overflow-hidden h-14">
              <button @click="qty > 1 ? qty-- : null" class="px-4 hover:bg-gray-50">-</button>
              <input type="number" v-model="qty" class="w-12 text-center bg-transparent outline-none" />
              <button @click="qty++" class="px-4 hover:bg-gray-50">+</button>
            </div>
            <button @click="addToCart" class="flex-grow bg-primary-600 text-white h-14 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center space-x-2">
              <span class="material-icons">shopping_bag</span>
              <span>Add to Cart</span>
            </button>
          </div>
          <button @click="buyNow" class="w-full h-14 border-2 border-primary-600 text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition">
            Buy Now
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="grid grid-cols-2 gap-y-4 gap-x-8 pt-8 border-t border-gray-100">
            <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span class="material-icons text-primary-500">payments</span>
                <span>Cash on Delivery</span>
            </div>
            <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span class="material-icons text-primary-500">local_shipping</span>
                <span>Free Delivery</span>
            </div>
            <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span class="material-icons text-primary-500">assignment_return</span>
                <span>7 Days Return Policy</span>
            </div>
            <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span class="material-icons text-primary-500">history_edu</span>
                <span>Buy Now Pay Later</span>
            </div>
        </div>

      </div>
    </div>

    <!-- Similar Products -->
    <div v-if="similarProducts.length" class="mt-24">
      <h2 class="text-3xl font-bold mb-8">Similar Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <ProductCard v-for="p in similarProducts" :key="p._id" :product="p" />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../../stores/useCart';
import { useTrackingStore } from '../../stores/useTracking';
import ProductCard from '../../components/user/ProductCard.vue';


const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const trackingStore = useTrackingStore();

const product = ref(null);
const similarProducts = ref([]);
const qty = ref(1);
const activeImage = ref('');


const allImages = computed(() => {
  if (!product.value) return [];
  return [product.value.thumbnail, ...(product.value.images || [])];
});

const fetchData = async () => {
  try {
    const res = await axios.get(`https://rizwan-store-api.onrender.com/api/products/${route.params.slug}`);
    product.value = res.data;
    activeImage.value = product.value.thumbnail;
    
    // Track product view
    trackingStore.trackProductView(product.value._id);

    // Fetch similar products
    const simRes = await axios.get(`https://rizwan-store-api.onrender.com/api/products`, {
      params: { category: product.value.category?._id }
    });
    similarProducts.value = simRes.data.filter(p => p._id !== product.value._id);
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchData);

watch(() => route.params.slug, () => {
  qty.value = 1;
  fetchData();
});


const getImage = (url) => {
  return url.startsWith('http') ? url : `https://rizwan-store-api.onrender.com/uploads/${url}`;
};

const addToCart = () => {
  cartStore.addToCart(product.value, qty.value);
};

const buyNow = () => {
    cartStore.addToCart(product.value, qty.value);
    router.push('/checkout');
};
</script>
