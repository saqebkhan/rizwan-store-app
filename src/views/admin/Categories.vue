<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Categories</h1>
      <div class="flex flex-col space-y-4">
        <input v-model="newCatName" placeholder="New Category Name" class="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
        <input type="file" @change="handleCatImage" class="text-xs" />
        <button @click="createCategory" class="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg">
          <span class="material-icons">add</span>
          <span>Add Category</span>
        </button>
      </div>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="cat in categories" :key="cat._id" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <img :src="getImage(cat.image)" class="w-16 h-16 rounded-2xl object-cover" />
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

const categories = ref([]);
const newCatName = ref('');
const catImageFile = ref(null);

const handleCatImage = (e) => {
    catImageFile.value = e.target.files[0];
};

const fetchCategories = async () => {

    const res = await axios.get('http://localhost:5000/api/categories');
    categories.value = res.data;
};

onMounted(fetchCategories);

const createCategory = async () => {
    if (!newCatName.value) return;
    try {
        const formData = new FormData();
        formData.append('name', newCatName.value);
        if (catImageFile.value) formData.append('image', catImageFile.value);

        await axios.post('http://localhost:5000/api/categories', formData);
        newCatName.value = '';
        catImageFile.value = null;
        fetchCategories();
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error creating category');
    }
};



const getImage = (url) => {
    return url.startsWith('http') ? url : `http://localhost:5000/uploads/${url}`;
};
</script>
