<template>
  <div class="space-y-12 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Inventory Control</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Luxury Collections</h1>
        </div>
        <button @click="openModal()" class="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:bg-primary-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform active:scale-95">
          <span class="material-icons text-lg">add</span>
          <span>Launch New Selection</span>
        </button>
      </header>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Desktop Table View -->
        <div class="hidden md:block bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
          <div class="overflow-x-auto scrollbar-hide">
            <table class="w-full text-left whitespace-nowrap">
              <thead class="bg-slate-950 text-white">
                <tr>
                  <th class="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Product Selection</th>
                  <th class="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Category</th>
                  <th class="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Valuation</th>
                  <th class="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Inventory</th>
                  <th class="p-8 font-black uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="product in products" :key="product._id" class="group hover:bg-slate-50/50 transition-all duration-300">
                  <td class="p-8 min-w-[320px]">
                    <div class="flex items-center space-x-6">
                      <div class="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-sm border border-white group-hover:scale-105 transition-transform duration-500">
                        <img :src="getImageUrl(product.thumbnail)" loading="lazy" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-black text-slate-900 tracking-tight mb-1 text-sm md:text-base leading-snug">{{ product.title }}</p>
                        <p class="text-[8px] md:text-[9px] text-slate-300 font-bold uppercase tracking-widest">SKU: {{ product.sku }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-8">
                    <span class="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">{{ product.category?.name }}</span>
                  </td>
                  <td class="p-8">
                    <div class="flex flex-col">
                      <span class="font-black text-slate-900 tracking-tighter">₹{{ product.finalPrice }}</span>
                      <span v-if="product.discountPercentage" class="text-[9px] text-primary-600 font-bold uppercase tracking-widest mt-0.5">{{ product.discountPercentage }}% Priority Discount</span>
                    </div>
                  </td>
                  <td class="p-8">
                    <div class="flex items-center space-x-2">
                      <div class="w-1.5 h-1.5 rounded-full" :class="product.stockQuantity > 5 ? 'bg-green-500' : 'bg-primary-500'"></div>
                      <span :class="product.stockQuantity > 5 ? 'text-slate-900' : 'text-primary-600'" class="font-black text-sm tabular-nums">
                        {{ product.stockQuantity }} Units
                      </span>
                    </div>
                  </td>
                  <td class="p-8 text-right">
                    <div class="flex items-center justify-end space-x-4 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 group-hover:translate-x-0">
                      <button @click="openModal(product)" class="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
                        <span class="material-icons text-xl">edit</span>
                      </button>
                      <button @click="deleteProduct(product._id)" class="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-slate-100">
                        <span class="material-icons text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-6">
          <div v-for="product in products" :key="product._id" class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-6">
            <div class="flex items-center space-x-5">
              <div class="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                <img :src="getImageUrl(product.thumbnail)" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow">
                <p class="font-black text-slate-900 tracking-tight mb-1">{{ product.title }}</p>
                <span class="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">{{ product.category?.name }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p class="text-[8px] text-slate-300 font-black uppercase tracking-widest mb-1">Valuation</p>
                <p class="font-black text-slate-900">₹{{ product.finalPrice }}</p>
              </div>
              <div>
                <p class="text-[8px] text-slate-300 font-black uppercase tracking-widest mb-1">Inventory</p>
                <div class="flex items-center space-x-2">
                  <div class="w-1.5 h-1.5 rounded-full" :class="product.stockQuantity > 5 ? 'bg-green-500' : 'bg-primary-500'"></div>
                  <span class="font-black text-xs">{{ product.stockQuantity }} Units</span>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="openModal(product)" class="flex-1 bg-slate-50 text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                <span class="material-icons text-sm">edit</span> Edit
              </button>
              <button @click="deleteProduct(product._id)" class="flex-1 bg-primary-50 text-primary-600 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                <span class="material-icons text-sm">delete</span> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sophisticated Product Modal -->
      <Transition name="scale">
        <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
          <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" @click="showModal = false"></div>
          <div class="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-[201] shadow-[0_50px_150px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col">
            
            <header class="p-10 md:p-12 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Curation Wizard</span>
                <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">{{ editingId ? 'Refine Masterpiece' : 'Create New Collection' }}</h2>
              </div>
              <button @click="showModal = false" class="w-14 h-14 bg-slate-50 text-slate-300 hover:text-slate-900 rounded-full flex items-center justify-center transition-all">
                <span class="material-icons text-3xl">close</span>
              </button>
            </header>

            <div class="flex-grow overflow-auto p-10 md:p-12 scrollbar-hide">
              <form @submit.prevent="saveProduct" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div class="md:col-span-2 space-y-3">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exquisite Title</label>
                      <input v-model="form.title" required placeholder="Name your product masterpiece" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
                  </div>

                  <div class="space-y-3">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selection Category</label>
                      <select v-model="form.category" required class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all appearance-none cursor-pointer">
                          <option value="" disabled>Choose Collection Type</option>
                          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                      </select>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-3">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input v-model.number="form.price" type="number" required class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
                    </div>
                    <div class="space-y-3">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Units</label>
                      <input v-model.number="form.stockQuantity" type="number" required class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
                    </div>
                  </div>

                  <div class="md:col-span-2 space-y-3">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">The Narrative</label>
                      <textarea v-model="form.description" required rows="4" placeholder="Craft the story behind this selection..." class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all resize-none"></textarea>
                  </div>

                  <!-- Media Management -->
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    <div class="space-y-3 group">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Signature Image</label>
                      <div class="relative h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all group-hover:bg-white group-hover:border-primary-500/50 overflow-hidden">
                        <input type="file" @change="handleThumbnail" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div v-if="!thumbnailPreview" class="text-center">
                          <span class="material-icons text-3xl text-slate-300 mb-2">add_photo_alternate</span>
                          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
                        </div>
                        <img v-else :src="thumbnailPreview" class="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </div>
                    
                    <div v-for="(file, idx) in 2" :key="idx" class="space-y-3 group">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gallery Perspective {{ idx + 1 }}</label>
                      <div class="relative h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all group-hover:bg-white group-hover:border-primary-500/50 overflow-hidden">
                        <input type="file" @change="e => handleGallery(e, idx)" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div v-if="!galleryPreviews[idx]" class="text-center">
                          <span class="material-icons text-3xl text-slate-300 mb-2">collections</span>
                          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Perspective</p>
                        </div>
                        <img v-else :src="galleryPreviews[idx]" class="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  <div class="md:col-span-2 pt-12">
                    <button type="submit" :disabled="isSaving" class="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 transition-all shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex items-center justify-center gap-4 disabled:opacity-50 transform active:scale-[0.98]">
                      {{ isSaving ? 'Committing Changes...' : (editingId ? 'Refine & Synchronize' : 'Authorize Release') }}
                      <span class="material-icons text-lg">auto_fix_high</span>
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService, categoryService } from '../../services/api';
import { useApi } from '../../composables/useApi';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const api = useApi();
const toast = useToast();
const loading = api.loading;
const isSaving = ref(false);

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
const thumbnailPreview = ref(null);
const galleryFiles = ref([null, null]);
const galleryPreviews = ref([null, null]);

const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      thumbnailFile.value = file;
      thumbnailPreview.value = URL.createObjectURL(file);
    }
};

const handleGallery = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      galleryFiles.value[index] = file;
      galleryPreviews.value[index] = URL.createObjectURL(file);
    }
};

const fetchProducts = async () => {
    const data = await productService.getAll();
    products.value = data;
};

const fetchCategories = async () => {
    const data = await categoryService.getAll();
    categories.value = data;
};

onMounted(async () => {
    try {
        await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (error) {}
});

const openModal = (product = null) => {
    resetForm();
    if (product) {
        editingId.value = product._id;
        form.value = { ...product, category: product.category?._id || product.category };
        thumbnailPreview.value = getImageUrl(product.thumbnail);
        if (product.images && product.images.length) {
          product.images.forEach((img, idx) => {
            if (idx < 2) galleryPreviews.value[idx] = getImageUrl(img);
          });
        }
    }
    showModal.value = true;
};

const saveProduct = async () => {
    try {
        if (!editingId.value && !thumbnailFile.value) {
            return toast.error('Selection signature image is required');
        }

        isSaving.value = true;
        const formData = new FormData();
        Object.keys(form.value).forEach(key => {
            if (key !== 'category' && typeof form.value[key] !== 'undefined') {
              formData.append(key, form.value[key]);
            }
        });
        formData.append('category', form.value.category);
        
        if (thumbnailFile.value) formData.append('thumbnail', thumbnailFile.value);
        galleryFiles.value.forEach(file => {
            if (file) formData.append('images', file);
        });

        if (!editingId.value) {
            formData.append('sku', 'RZ-' + Math.random().toString(36).substr(2, 6).toUpperCase());
        }

        if (editingId.value) {
            await productService.update(editingId.value, formData);
            toast.success('Collection masterpiece refined');
        } else {
            await productService.create(formData);
            toast.success('New collection launched successfully');
        }
        showModal.value = false;
        await fetchProducts();
    } catch (err) {
    } finally {
        isSaving.value = false;
    }
};

const resetForm = () => {
    form.value = { title: '', price: 0, discountPercentage: 0, stockQuantity: 0, category: '', description: '' };
    thumbnailFile.value = null;
    thumbnailPreview.value = null;
    galleryFiles.value = [null, null];
    galleryPreviews.value = [null, null];
    editingId.value = null;
};

const deleteProduct = async (id) => {
    if (confirm('Authorize removal of this collection?')) {
        try {
            await productService.delete(id);
            toast.success('Collection removed from inventory');
            await fetchProducts();
        } catch (error) {}
    }
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

.scale-enter-active, .scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
}
</style>
