<template>
  <div class="space-y-12 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-8 mb-12">
        <div class="space-y-1">
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] block">Taxonomy Management</span>
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Product Categories</h1>
        </div>
        
        <!-- Premium Creation Form -->
        <div class="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col sm:flex-row items-center gap-6 w-full lg:max-w-2xl">
          <div class="flex-grow w-full">
            <input v-model="newCatName" placeholder="Category Name" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
          </div>
          
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="relative group h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-white hover:border-primary-500/50 transition-all">
              <input type="file" @change="handleCatImage" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div v-if="!catImagePreview" class="flex items-center justify-center">
                <span class="material-icons text-slate-300">add_a_photo</span>
              </div>
              <img v-else :src="catImagePreview" class="absolute inset-0 w-full h-full object-cover" />
            </div>

            <button @click="createCategory" :disabled="isSaving" class="flex-grow sm:flex-initial bg-slate-950 text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 shadow-xl hover:bg-primary-600 transition-all shrink-0 disabled:opacity-50">
              <span class="material-icons text-sm">{{ isSaving ? 'sync' : 'add' }}</span>
              <span>{{ isSaving ? 'Launch' : 'Launch' }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Category Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <TransitionGroup name="list">
          <div v-for="cat in categories" :key="cat._id" 
            class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 flex items-center space-x-6 hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] hover:border-primary-500/20 transition-all duration-500 group relative overflow-hidden">
            
            <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>

            <div class="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500 relative z-10">
              <img :src="getImageUrl(cat.image)" loading="lazy" class="w-full h-full object-cover" />
            </div>
            
            <div class="flex-grow relative z-10">
              <h3 class="font-black text-slate-900 tracking-tight text-lg mb-1">{{ cat.name }}</h3>
              <div class="flex items-center space-x-3">
                <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest">{{ cat.viewCount || 0 }} Interactions</span>
                <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span class="text-[9px] text-primary-600 font-black uppercase tracking-widest">Active</span>
              </div>
            </div>

            <button @click="deleteCategory(cat._id)" class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-primary-600 hover:bg-primary-50 transition-all relative z-10 md:opacity-0 group-hover:opacity-100 md:translate-y-2 group-hover:translate-y-0 duration-300">
              <span class="material-icons text-xl">delete</span>
            </button>
          </div>
        </TransitionGroup>
      </div>

      <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <span class="material-icons text-7xl text-slate-200 mb-6">category</span>
        <p class="text-slate-400 font-black uppercase tracking-widest text-sm">Empty Ecosystem Taxonomy</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { categoryService } from '../../services/api';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const toast = useToast();
const loading = ref(false);
const isSaving = ref(false);

const categories = ref([]);
const newCatName = ref('');
const catImageFile = ref(null);
const catImagePreview = ref(null);

const handleCatImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      catImageFile.value = file;
      catImagePreview.value = URL.createObjectURL(file);
    }
};

const fetchCategories = async () => {
    try {
      loading.value = true;
      const data = await categoryService.getAll();
      categories.value = data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
};

onMounted(fetchCategories);

const createCategory = async () => {
    if (!newCatName.value) return toast.error('Category name required');
    try {
        isSaving.value = true;
        const formData = new FormData();
        formData.append('name', newCatName.value);
        if (catImageFile.value) formData.append('image', catImageFile.value);

        await categoryService.create(formData);
        newCatName.value = '';
        catImageFile.value = null;
        catImagePreview.value = null;
        toast.success('Collection category authorized');
        await fetchCategories();
    } catch (err) {
    } finally {
        isSaving.value = false;
    }
};

const deleteCategory = async (id) => {
  if (confirm('Authorize removal of this category?')) {
    try {
      await categoryService.delete(id);
      toast.success('Category removed from ecosystem');
      await fetchCategories();
    } catch (error) {}
  }
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
