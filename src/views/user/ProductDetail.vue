<template>
  <div class="min-h-screen bg-white">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="product" class="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <!-- Breadcrumbs -->
      <nav class="flex text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 md:mb-12 space-x-2 overflow-x-auto whitespace-nowrap">
        <router-link to="/" class="hover:text-primary-600">Home</router-link>
        <span>/</span>
        <router-link to="/products" class="hover:text-primary-600">Products</router-link>
        <span>/</span>
        <span class="text-slate-900">{{ product.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Image Gallery -->
        <div class="space-y-6">
          <div class="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 relative group cursor-zoom-in shadow-2xl">
            <img :src="getImageUrl(activeImage)" loading="lazy" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
            <div v-if="product.discountPercentage" class="absolute top-8 left-8 bg-primary-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
              -{{ product.discountPercentage }}%
            </div>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              v-for="img in allImages" 
              :key="img" 
              @click="activeImage = img"
              :class="activeImage === img ? 'border-slate-900 ring-4 ring-slate-900/5 shadow-xl' : 'border-slate-100 opacity-60'"
              class="w-24 h-24 rounded-[1.5rem] flex-shrink-0 overflow-hidden transition-all border-2"
            >
              <img :src="getImageUrl(img)" loading="lazy" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <div class="mb-8">
            <p class="text-xs text-primary-600 font-bold uppercase tracking-[0.3em] mb-4">{{ product.category?.name || 'Exclusive' }}</p>
            <h1 class="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter mb-6">{{ product.title }}</h1>
            
            <div class="flex items-center space-x-6">
              <span class="text-4xl font-black text-slate-900 tracking-tighter">₹{{ product.finalPrice }}</span>
              <span v-if="product.discountPercentage" class="text-xl text-slate-400 line-through font-bold">₹{{ product.price }}</span>
            </div>
          </div>

          <p class="text-slate-500 leading-relaxed mb-10 text-lg lg:text-xl font-medium">{{ product.description }}</p>

          <div class="space-y-6 mb-12">
            <div class="flex items-center space-x-4 h-16">
              <div class="flex items-center bg-slate-50 border border-slate-100 rounded-2xl h-full px-2">
                <button @click="qty > 1 ? qty-- : null" class="w-12 h-12 flex items-center justify-center hover:text-primary-600 transition">
                  <span class="material-icons">remove</span>
                </button>
                <input type="number" v-model="qty" class="w-12 text-center bg-transparent outline-none font-black text-lg" readonly />
                <button @click="qty++" class="w-12 h-12 flex items-center justify-center hover:text-primary-600 transition">
                  <span class="material-icons">add</span>
                </button>
              </div>
              <button @click="addToCart" class="flex-grow bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs h-full hover:bg-primary-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                <span class="material-icons text-xl">shopping_bag</span>
                Add To Bag
              </button>
            </div>
            <div class="flex items-center space-x-4">
              <button @click="buyNow" class="flex-grow h-16 border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm">
                Buy It Now
              </button>
              <button @click="wishlistStore.toggleWishlist(product)" class="w-16 h-16 rounded-2xl border-2 border-slate-100 flex items-center justify-center transition-all" :class="wishlistStore.isInWishlist(product._id) ? 'border-primary-600 text-primary-600 bg-primary-50' : 'text-slate-400 hover:border-slate-300 hover:text-slate-600'">
                <span class="material-icons text-2xl">{{ wishlistStore.isInWishlist(product._id) ? 'favorite' : 'favorite_border' }}</span>
              </button>
            </div>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
            <div class="flex items-start space-x-4">
              <div class="bg-primary-50 p-2 rounded-xl text-primary-600">
                <span class="material-icons">payments</span>
              </div>
              <div>
                <h4 class="font-black text-xs uppercase tracking-widest text-slate-900">COD Available</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pay upon arrival</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="bg-primary-50 p-2 rounded-xl text-primary-600">
                <span class="material-icons">local_shipping</span>
              </div>
              <div>
                <h4 class="font-black text-xs uppercase tracking-widest text-slate-900">Free Delivery</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Across all regions</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="bg-primary-50 p-2 rounded-xl text-primary-600">
                <span class="material-icons">assignment_return</span>
              </div>
              <div>
                <h4 class="font-black text-xs uppercase tracking-widest text-slate-900">7-Day Return</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hassle-free process</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="bg-primary-50 p-2 rounded-xl text-primary-600">
                <span class="material-icons">credit_score</span>
              </div>
              <div>
                <h4 class="font-black text-xs uppercase tracking-widest text-slate-900">Swift Service</h4>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">You Checkout We Deliver</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Products -->
      <section v-if="similarProducts.length" class="mt-32">
        <div class="mb-12">
          <span class="text-primary-600 font-bold uppercase tracking-widest text-[10px] mb-3 block">Complete The Look</span>
          <h2 class="text-4xl font-black text-slate-900 tracking-tight">Products You May Like</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard v-for="p in similarProducts" :key="p._id" :product="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productService } from '../../services/api';
import { useCartStore } from '../../stores/useCart';
import { useWishlistStore } from '../../stores/useWishlist';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';
import ProductCard from '../../components/user/ProductCard.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const toast = useToast();
const loading = ref(false);

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
    loading.value = true;
    const data = await productService.getOne(route.params.slug);
    product.value = data;
    activeImage.value = product.value.thumbnail;
    
    // Fetch similar products
    const simData = await productService.getAll({ category: product.value.category?._id });
    similarProducts.value = simData.filter(p => p._id !== product.value._id);
  } catch (err) {
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

watch(() => route.params.slug, () => {
  qty.value = 1;
  fetchData();
});

const addToCart = () => {
  cartStore.addToCart(product.value, qty.value);
  toast.success(`Added ${qty.value} ${product.value.title} to your bag`);
};

const buyNow = () => {
    cartStore.addToCart(product.value, qty.value);
    router.push('/checkout');
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
