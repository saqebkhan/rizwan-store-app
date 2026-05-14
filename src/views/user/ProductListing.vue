<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-2">Our Collection</h1>
        <p class="text-gray-500">{{ products.length }} items found</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="filters.sort" class="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500">
          <option value="popularity">Sort by Popularity</option>
          <option value="newest">Sort by Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Sidebar Filters -->
      <aside class="space-y-8">
        <div>
          <h3 class="font-bold mb-4">Categories</h3>
          <div class="space-y-2">
            <label v-for="cat in categories" :key="cat._id" class="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" :value="cat._id" v-model="filters.category" class="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <span class="text-gray-600 group-hover:text-primary-600 transition">{{ cat.name }}</span>
            </label>
          </div>

        </div>
      </aside>

      <!-- Product Grid -->
      <div class="md:col-span-3">
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-gray-100 animate-pulse rounded-2xl aspect-[3/4]"></div>
        </div>
        <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <span class="material-icons text-6xl text-gray-200 mb-4">search_off</span>
          <p class="text-gray-500">No products found matching your criteria.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in products" :key="product._id" :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProductCard from '../../components/user/ProductCard.vue';

const route = useRoute();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const filters = ref({
  category: route.query.category || '',
  sort: 'popularity'
});


const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get('https://rizwan-store-api.onrender.com/api/products', { params: filters.value });
    products.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await axios.get('https://rizwan-store-api.onrender.com/api/categories');
    categories.value = res.data;
  } catch (err) {
    console.error(err);
  }
  fetchProducts();
});

watch(filters, fetchProducts, { deep: true });

watch(() => route.query.category, (newCat) => {
  if (newCat !== undefined) {
    filters.value.category = newCat;
  }
});

</script>
