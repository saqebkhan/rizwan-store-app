<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else class="space-y-6">
    <LoadingSpinner :show="isSaving" overlay />
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 class="text-3xl font-bold">Categories</h1>
      <div class="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 items-start sm:items-center">
        <input v-model="newCatName" placeholder="New Category Name" class="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto" />
        <input type="file" @change="handleCatImage" class="text-xs w-full sm:w-auto" />
        <button @click="createCategory" class="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg w-full sm:w-auto shrink-0">
          <span class="material-icons">add</span>
          <span>Add</span>
        </button>
      </div>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="cat in categories" :key="cat._id" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <img :src="getImage(cat.image)" loading="lazy" class="w-16 h-16 rounded-2xl object-cover shrink-0" />
        <div class="flex-grow">
          <h3 class="font-bold text-slate-900">{{ cat.name }}</h3>
          <p class="text-xs text-slate-400">{{ cat.viewCount }} views</p>
        </div>
        <button class="text-slate-300 hover:text-red-500 transition">
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const isLoading = ref(false);
const isSaving = ref(false);

const categories = ref([]);
const newCatName = ref('');
const catImageFile = ref(null);

const handleCatImage = (e) => {
    catImageFile.value = e.target.files[0];
};

const fetchCategories = async () => {
    try {
        isLoading.value = true;
        const res = await axios.get('https://rizwan-store-api.onrender.com/api/categories');
        categories.value = res.data;
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to fetch categories.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCategories);

const createCategory = async () => {
    if (!newCatName.value) return;
    try {
        isSaving.value = true;
        const formData = new FormData();
        formData.append('name', newCatName.value);
        if (catImageFile.value) formData.append('image', catImageFile.value);

        await axios.post('https://rizwan-store-api.onrender.com/api/categories', formData);
        newCatName.value = '';
        catImageFile.value = null;
        await fetchCategories();
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error creating category');
    } finally {
        isSaving.value = false;
    }
};



const getImage = (url) => {
    return url.startsWith('http') ? url : `https://rizwan-store-api.onrender.com/uploads/${url}`;
};
</script>
