<template>
  <div class="space-y-16 pb-20">
    <!-- Hero Carousel -->
    <section class="h-[70vh] bg-slate-900 relative flex items-center overflow-hidden">
      <transition-group name="fade" tag="div" class="absolute inset-0">
        <div v-for="(banner, index) in banners" :key="banner._id" v-show="activeBanner === index" class="absolute inset-0">
          <img :src="getImage(banner.image)" class="w-full h-full object-cover opacity-60" />
          <div class="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 text-white max-w-2xl">
            <h1 class="text-5xl md:text-7xl font-bold mb-6 slide-up">{{ banner.title }}</h1>
            <p class="text-xl mb-8 text-gray-300">{{ banner.subtitle }}</p>
            <router-link v-if="banner.link" :to="banner.link" class="bg-primary-600 text-white px-10 py-4 rounded-full font-bold hover:bg-primary-500 transition-all transform hover:scale-105 inline-block w-fit">
              {{ banner.buttonText || 'Shop Now' }}
            </router-link>
          </div>
        </div>
      </transition-group>
      <!-- Fallback if no banners -->
      <div v-if="banners.length === 0" class="relative z-10 px-8 md:px-20 text-white max-w-2xl">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 slide-up">Elevate Your Lifestyle</h1>
        <p class="text-xl mb-8 text-gray-300">Discover premium products curated for the modern minimalist.</p>
        <router-link to="/products" class="bg-primary-600 text-white px-10 py-4 rounded-full font-bold hover:bg-primary-500 transition-all transform hover:scale-105 inline-block">
          Shop Now
        </router-link>
      </div>
    </section>


    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold">Shop by Category</h2>
        <button @click="goToRandomCategory" class="text-primary-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">View All</button>

      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="cat in categories" :key="cat._id" @click="router.push('/products?category=' + cat._id)" class="group cursor-pointer">
          <div class="aspect-square rounded-2xl overflow-hidden mb-3">
            <img :src="getImage(cat.image)" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          </div>
          <h3 class="font-bold text-center group-hover:text-primary-600">{{ cat.name }}</h3>
        </div>

      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4">
      <div class="mb-10 text-center">
        <h2 class="text-4xl font-bold mb-4">Featured Selection</h2>
        <p class="text-gray-500">Handpicked items just for you</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard v-for="p in featuredProducts" :key="p._id" :product="p" />
      </div>
    </section>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProductCard from '../../components/user/ProductCard.vue';

const router = useRouter();
const banners = ref([]);
const categories = ref([]);
const activeBanner = ref(0);
const featuredProducts = ref([]);



onMounted(async () => {

  try {
    const [catRes, prodRes, bannerRes] = await Promise.all([
      axios.get('http://localhost:5000/api/categories'),
      axios.get('http://localhost:5000/api/products?featured=true'),
      axios.get('http://localhost:5000/api/banners')
    ]);
    categories.value = catRes.data;
    featuredProducts.value = prodRes.data;
    banners.value = bannerRes.data;

    // Banner rotation
    if (banners.value.length > 1) {
      setInterval(() => {
        activeBanner.value = (activeBanner.value + 1) % banners.value.length;
      }, 5000);
    }
  } catch (error) {
    console.error(error);
  }
});

const getImage = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:5000/uploads/${url}`;
};


const goToRandomCategory = () => {
    if (categories.value.length > 0) {
        const randomCat = categories.value[Math.floor(Math.random() * categories.value.length)];
        router.push(`/products?category=${randomCat._id}`);
    } else {
        router.push('/products');
    }
};

const submitLead = async () => {

  // Logic removed, handled by Layout
};

</script>
