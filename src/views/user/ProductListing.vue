<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <LoadingSpinner v-if="loadingCategories" />
    <div v-else class="flex flex-col lg:flex-row gap-12">
      <!-- Sidebar Filters (Desktop) / Horizontal Scroll (Mobile) -->
      <aside class="lg:w-64 flex-shrink-0">
        <div class="sticky top-24 z-50">
          <div class="mb-10 lg:mb-12">
            <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Our Collection</h1>
            <p class="text-xs text-slate-400 uppercase tracking-widest font-bold">{{ products.length }} Items Found</p>
          </div>

          <!-- Category Filter -->
          <div class="mb-10">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Categories</h3>
            <div class="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
              <button 
                @click="filters.category = ''" 
                class="whitespace-nowrap px-6 lg:px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border"
                :class="filters.category === '' ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'"
              >
                All Collections
              </button>
              <button 
                v-for="cat in categories" :key="cat._id"
                @click="filters.category = cat._id" 
                class="whitespace-nowrap px-6 lg:px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border"
                :class="filters.category === cat._id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Premium Sort Filter -->
          <div class="relative">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Refine By</h3>
            
            <button 
              @click="isSortOpen = !isSortOpen"
              class="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 hover:bg-white hover:border-primary-500 transition-all group"
            >
              <div class="flex items-center space-x-3">
                <span class="material-icons text-slate-400 group-hover:text-primary-600 transition text-lg">sort</span>
                <span class="font-black text-xs uppercase tracking-widest text-slate-900">{{ sortLabels[filters.sort] }}</span>
              </div>
              <span class="material-icons text-slate-300 transition-transform duration-300" :class="{'rotate-180': isSortOpen}">expand_more</span>
            </button>

            <Transition name="fade-up">
              <div v-if="isSortOpen" class="absolute top-full left-0 right-0 mt-4 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[50] p-2">
                <button 
                  v-for="(label, value) in sortLabels" 
                  :key="value"
                  @click="selectSort(value)"
                  class="w-full flex items-center justify-between p-4 hover:bg-primary-50 rounded-2xl transition-all group"
                  :class="{'bg-primary-50/50': filters.sort === value}"
                >
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="filters.sort === value ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-900'">{{ label }}</span>
                  <span v-if="filters.sort === value" class="material-icons text-primary-600 text-sm">check_circle</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <div v-if="loadingProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          <div v-for="i in 6" :key="i" class="bg-slate-100 aspect-[4/5] rounded-[2rem]"></div>
        </div>
        <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <span class="material-icons text-7xl text-slate-200 mb-6">inventory_2</span>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">No products found</p>
          <button @click="filters.category = ''" class="mt-6 text-primary-600 font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</button>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <ProductCard v-for="product in products" :key="product._id" :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { productService, categoryService } from '../../services/api';
import ProductCard from '../../components/user/ProductCard.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const route = useRoute();
const loadingProducts = ref(false);
const loadingCategories = ref(true);

const products = ref([]);
const categories = ref([]);
const isSortOpen = ref(false);
const sortLabels = {
  popularity: 'Most Popular',
  newest: 'New Arrivals',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low'
};

const selectSort = (value) => {
  filters.value.sort = value;
  isSortOpen.value = false;
};

const filters = ref({
  category: route.query.category || '',
  sort: 'popularity'
});

const fetchProducts = async () => {
  try {
    loadingProducts.value = true;
    const data = await productService.getAll(filters.value);
    products.value = data;
  } catch (err) {
  } finally {
    loadingProducts.value = false;
  }
};

onMounted(async () => {
  try {
    const data = await categoryService.getAll();
    categories.value = data;
  } finally {
    loadingCategories.value = false;
  }
  await fetchProducts();
});

watch(filters, fetchProducts, { deep: true });

watch(() => route.query.category, (newCat) => {
  if (newCat !== undefined) {
    filters.value.category = newCat;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(5px) scale(0.98);
}
</style>
