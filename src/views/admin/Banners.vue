<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Homepage Banners</h1>
      <button @click="showModal = true" class="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
        <span class="material-icons">add</span>
        <span>Add Banner</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="banner in banners" :key="banner._id" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group relative">
        <img :src="getImage(banner.image)" class="w-full h-48 object-cover" />
        <div class="p-6">
          <h3 class="font-bold text-lg">{{ banner.title || 'No Title' }}</h3>
          <p class="text-sm text-gray-500">{{ banner.subtitle || 'No Subtitle' }}</p>
          <div class="flex justify-end space-x-4 mt-4">
            <button @click="deleteBanner(banner._id)" class="text-red-500">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Banner Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10">
            <h2 class="text-2xl font-bold mb-6">Add New Banner</h2>
            <form @submit.prevent="saveBanner" class="space-y-4">
                <input v-model="form.title" placeholder="Banner Title" class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none" />
                <input v-model="form.subtitle" placeholder="Banner Subtitle" class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none" />
                <input type="file" @change="handleFile" class="text-sm" />
                <div class="flex justify-end space-x-4 pt-4">
                    <button type="button" @click="showModal = false" class="text-gray-400 font-bold">Cancel</button>
                    <button type="submit" class="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold">Save Banner</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const banners = ref([]);
const showModal = ref(false);
const form = ref({ title: '', subtitle: '' });
const file = ref(null);

const fetchBanners = async () => {
    const res = await axios.get('http://localhost:5000/api/banners/all');
    banners.value = res.data;
};

onMounted(fetchBanners);

const handleFile = (e) => {
    file.value = e.target.files[0];
};

const saveBanner = async () => {
    try {
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('subtitle', form.value.subtitle);
        if (file.value) formData.append('image', file.value);

        await axios.post('http://localhost:5000/api/banners', formData);
        showModal.value = false;
        form.value = { title: '', subtitle: '' };
        file.value = null;
        fetchBanners();
    } catch (err) {
        console.error(err);
    }
};

const deleteBanner = async (id) => {
    if (confirm('Delete banner?')) {
        await axios.delete(`http://localhost:5000/api/banners/${id}`);
        fetchBanners();
    }
};

const getImage = (url) => `http://localhost:5000/uploads/${url}`;
</script>
