<template>
  <div class="space-y-16 pb-20">
    <LoadingSpinner v-if="loading" />
    <div v-else>
      <!-- Hero Section -->
      <section class="h-[80vh] bg-slate-950 relative flex items-center overflow-hidden">
        <TransitionGroup name="hero" tag="div" class="absolute inset-0">
          <div v-for="(banner, index) in banners" :key="banner._id" v-show="activeBanner === index" class="absolute inset-0">
            <img :src="getImageUrl(banner.image)" loading="lazy" class="w-full h-full object-cover opacity-50 transition-transform duration-[10s] scale-110" :class="{ 'scale-100': activeBanner === index }" />
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>
            <div class="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 text-white max-w-3xl">
              <span class="text-primary-400 font-bold tracking-[0.3em] uppercase mb-4 block animate-fade-in">Premium Selection</span>
              <h1 class="text-5xl md:text-8xl font-black mb-6 leading-tight">{{ banner.title }}</h1>
              <p class="text-xl mb-10 text-gray-300 max-w-lg leading-relaxed">{{ banner.subtitle }}</p>
              <router-link v-if="banner.link" :to="banner.link" class="group relative bg-primary-600 text-white px-12 py-5 rounded-full font-black overflow-hidden transition-all hover:pr-16 w-fit shadow-2xl shadow-primary-900/20">
                <span class="relative z-10 uppercase tracking-widest">{{ banner.buttonText || 'Discover' }}</span>
                <span class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all material-icons">arrow_forward</span>
              </router-link>
            </div>
          </div>
        </TransitionGroup>
        
        <!-- Hero Pagination -->
        <div class="absolute bottom-10 left-8 md:left-20 flex space-x-3 z-20">
          <button v-for="(_, i) in banners" :key="i" @click="activeBanner = i" 
            class="h-1.5 transition-all duration-500 rounded-full"
            :class="activeBanner === i ? 'w-12 bg-primary-500' : 'w-4 bg-white/20 hover:bg-white/40'">
          </button>
        </div>
      </section>

      <!-- Featured Categories (Redesigned) -->
      <section class="max-w-7xl mx-auto px-6 -mt-16 relative z-30">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div v-for="cat in categories" :key="cat._id" 
            @click="router.push('/products?category=' + cat._id)" 
            class="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-transform hover:-translate-y-2">
            <img :src="getImageUrl(cat.image)" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
              <h3 class="text-white font-black text-xl mb-1">{{ cat.name }}</h3>
              <p class="text-gray-400 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Explore Collection</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar (New Feature: Business Analyst Thinking) -->
      <section class="max-w-7xl mx-auto px-6 py-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          <div class="text-center">
            <div class="text-3xl font-black text-slate-900 mb-1">50k+</div>
            <div class="text-xs text-slate-400 uppercase tracking-widest">Happy Customers</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-slate-900 mb-1">99.9%</div>
            <div class="text-xs text-slate-400 uppercase tracking-widest">Quality Score</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-slate-900 mb-1">24h</div>
            <div class="text-xs text-slate-400 uppercase tracking-widest">Fast Support</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-slate-900 mb-1">FREE</div>
            <div class="text-xs text-slate-400 uppercase tracking-widest">Global Delivery</div>
          </div>
        </div>
      </section>

      <!-- Featured Selection -->
      <section class="max-w-7xl mx-auto px-6 mb-32">
        <div class="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div class="max-w-xl">
            <span class="text-primary-600 font-bold uppercase tracking-widest text-xs mb-3 block">Our Portfolio</span>
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Handpicked Selection For Your Lifestyle</h2>
          </div>
          <button @click="goToRandomCategory" class="group flex items-center space-x-2 text-slate-900 font-black hover:text-primary-600 transition">
            <span class="uppercase tracking-widest text-sm">View All Products</span>
            <span class="material-icons text-xl group-hover:translate-x-1 transition">east</span>
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard v-for="p in featuredProducts" :key="p._id" :product="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { bannerService, categoryService, productService } from '../../services/api';
import { getImageUrl } from '../../utils/image';
import ProductCard from '../../components/user/ProductCard.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const router = useRouter();
const loading = ref(false);

const banners = ref([]);
const categories = ref([]);
const activeBanner = ref(0);
const featuredProducts = ref([]);

onMounted(async () => {
  try {
    loading.value = true;
    const [catData, prodData, bannerData] = await Promise.all([
      categoryService.getAll(),
      productService.getFeatured(),
      bannerService.getAll()
    ]);
    categories.value = catData;
    featuredProducts.value = prodData;
    banners.value = bannerData;

    if (banners.value.length > 1) {
      setInterval(() => {
        activeBanner.value = (activeBanner.value + 1) % banners.value.length;
      }, 7000);
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
});

const goToRandomCategory = () => {
    if (categories.value.length > 0) {
        const randomCat = categories.value[Math.floor(Math.random() * categories.value.length)];
        router.push(`/products?category=${randomCat._id}`);
    } else {
        router.push('/products');
    }
};
</script>

<style scoped>
.hero-enter-active, .hero-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.hero-enter-from, .hero-leave-to {
  opacity: 0;
}
</style>
