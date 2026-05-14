<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Manage Products</h1>
      <button @click="openModal()" class="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary-700 transition shadow-lg">
        <span class="material-icons">add</span>
        <span>Add New Product</span>
      </button>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-gray-100">
          <tr>
            <th class="p-6 font-bold text-slate-600">Product</th>
            <th class="p-6 font-bold text-slate-600">Category</th>
            <th class="p-6 font-bold text-slate-600">Price</th>
            <th class="p-6 font-bold text-slate-600">Stock</th>
            <th class="p-6 font-bold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="product in products" :key="product._id" class="hover:bg-slate-50 transition">
            <td class="p-6">
              <div class="flex items-center space-x-4">
                <img :src="getImage(product.thumbnail)" class="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p class="font-bold text-slate-900">{{ product.title }}</p>
                  <p class="text-xs text-slate-400">SKU: {{ product.sku }}</p>
                </div>
              </div>
            </td>
            <td class="p-6">
              <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{{ product.category?.name }}</span>
            </td>
            <td class="p-6">
              <p class="font-bold text-slate-900">₹{{ product.finalPrice }}</p>
              <p v-if="product.discountPercentage" class="text-xs text-red-500">-{{ product.discountPercentage }}% Off</p>
            </td>
            <td class="p-6">
              <span :class="product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'" class="font-bold">
                {{ product.stockQuantity }}
              </span>
            </td>
            <td class="p-6">
              <div class="flex space-x-3">
                <button @click="openModal(product)" class="text-primary-600 hover:text-primary-800 transition">
                  <span class="material-icons">edit</span>
                </button>
                <button @click="deleteProduct(product._id)" class="text-red-500 hover:text-red-700 transition">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Placeholder -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-auto relative z-10 p-8">
        <h2 class="text-2xl font-bold mb-8">{{ editingId ? 'Edit Product' : 'Add New Product' }}</h2>
        <!-- Product Form -->
        <form @submit.prevent="saveProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Form fields would go here... for brevity I'll skip detailed form but keep it functional for Title/Price -->
            <div class="md:col-span-2">
                <label class="block text-sm font-bold text-slate-700 mb-2">Title <span class="text-red-500">*</span></label>
                <input v-model="form.title" required placeholder="e.g. iPhone 15 Pro" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div class="md:col-span-2">
                <label class="block text-sm font-bold text-slate-700 mb-2">Category <span class="text-red-500">*</span></label>
                <select v-model="form.category" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select Category</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Price (₹) <span class="text-red-500">*</span></label>
                <input v-model.number="form.price" type="number" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Discount (%)</label>
                <input v-model.number="form.discountPercentage" type="number" placeholder="0" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Stock <span class="text-red-500">*</span></label>
                <input v-model.number="form.stockQuantity" type="number" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div class="md:col-span-2">
                <label class="block text-sm font-bold text-slate-700 mb-2">Description <span class="text-red-500">*</span></label>
                <textarea v-model="form.description" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"></textarea>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Thumbnail <span class="text-red-500">*</span></label>
                <input type="file" @change="handleThumbnail" class="w-full text-sm" />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Gallery Image 1 (Optional)</label>
                <input type="file" @change="e => handleGallery(e, 0)" class="w-full text-sm" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Gallery Image 2 (Optional)</label>
                <input type="file" @change="e => handleGallery(e, 1)" class="w-full text-sm" />
            </div>

            <div class="md:col-span-2 flex justify-end space-x-4 mt-6">

                <button type="button" @click="showModal = false" class="px-6 py-3 text-slate-400 font-bold">Cancel</button>
                <button type="submit" class="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
                    {{ editingId ? 'Update Product' : 'Save Product' }}
                </button>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);
const categories = ref([]);
const showModal = ref(false);
const editingId = ref(null);
const form = ref({
    title: '',
    price: 0,
    discountPercentage: 0,
    stockQuantity: 0,
    category: '',
    description: '',
});

const thumbnailFile = ref(null);
const galleryFiles = ref([null, null]);

const handleThumbnail = (e) => {
    thumbnailFile.value = e.target.files[0];
};

const handleGallery = (e, index) => {
    galleryFiles.value[index] = e.target.files[0];
};



const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    products.value = res.data;
};

const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/categories');
    categories.value = res.data;
};

onMounted(() => {
    fetchProducts();
    fetchCategories();
});


const getImage = (url) => {
    return url.startsWith('http') ? url : `http://localhost:5000/uploads/${url}`;
};

const openModal = (product = null) => {
    if (product) {
        editingId.value = product._id;
        form.value = { ...product };
    } else {
        editingId.value = null;
        form.value = { title: '', price: 0, stockQuantity: 0 };
    }
    showModal.value = true;
};

const saveProduct = async () => {
    try {
        if (!editingId.value && !thumbnailFile.value) {
            return alert('Please upload a product thumbnail image.');
        }

        const formData = new FormData();
        Object.keys(form.value).forEach(key => {
            formData.append(key, form.value[key]);
        });
        
        if (thumbnailFile.value) formData.append('thumbnail', thumbnailFile.value);
        galleryFiles.value.forEach(file => {
            if (file) formData.append('images', file);
        });


        if (!editingId.value) {
            formData.append('sku', 'SKU-' + Date.now());
        }

        if (editingId.value) {
            await axios.put(`http://localhost:5000/api/products/${editingId.value}`, formData);
        } else {
            await axios.post('http://localhost:5000/api/products', formData);
        }
        showModal.value = false;
        resetForm();
        fetchProducts();
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || '';
        if (msg.includes('thumbnail')) alert('Thumbnail image is required!');
        else if (msg.includes('finalPrice')) alert('Invalid price or discount calculation!');
        else alert(msg || 'Error saving product. Please check all required fields.');
    }
};

const resetForm = () => {
    form.value = { title: '', price: 0, discountPercentage: 0, stockQuantity: 0, category: '', description: '' };
    thumbnailFile.value = null;
    galleryFiles.value = [null, null];
    editingId.value = null;
};





const deleteProduct = async (id) => {
    if (confirm('Delete this product?')) {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    }
};
</script>
