<template>
  <div class="space-y-12 pb-32">
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-12">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">Visual Curation</span>
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ecosystem Banners</h1>
        </div>
        <button @click="showModal = true" class="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:bg-primary-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform active:scale-95">
          <span class="material-icons text-lg">add</span>
          <span>Launch New Visual</span>
        </button>
      </header>

      <!-- Banner Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div v-for="banner in banners" :key="banner._id" 
          class="bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 group hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-500">
          
          <!-- Visual Preview -->
          <div class="relative h-72 overflow-hidden bg-slate-100">
            <img :src="getImageUrl(banner.image)" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
            
            <div class="absolute bottom-8 left-8 right-8">
              <h3 class="text-white text-2xl font-black tracking-tight mb-1">{{ banner.title || 'Untitled Visual' }}</h3>
              <p class="text-white/80 text-xs font-bold uppercase tracking-widest">{{ banner.subtitle || 'No descriptive subtitle' }}</p>
            </div>
          </div>

          <div class="p-8 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active in Ecosystem</span>
            </div>
            
            <button @click="deleteBanner(banner._id)" class="w-12 h-12 bg-slate-50 text-slate-300 hover:bg-primary-50 hover:text-primary-600 rounded-2xl flex items-center justify-center transition-all">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>

        <div v-if="banners.length === 0" class="md:col-span-2 flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <span class="material-icons text-7xl text-slate-200 mb-6">view_carousel</span>
          <p class="text-slate-400 font-black uppercase tracking-widest text-sm">No visuals deployed yet</p>
        </div>
      </div>

      <!-- Sophisticated Banner Modal -->
      <Transition name="scale">
        <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
          <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" @click="showModal = false"></div>
          <div class="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden relative z-[201] shadow-[0_50px_150px_rgba(0,0,0,0.5)] border border-white/10">
            
            <header class="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <span class="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Visual Wizard</span>
                <h2 class="text-3xl font-black text-slate-900 tracking-tight leading-none">Deploy New Banner</h2>
              </div>
              <button @click="showModal = false" class="w-12 h-12 bg-slate-50 text-slate-300 hover:text-slate-900 rounded-full flex items-center justify-center transition-all">
                <span class="material-icons text-2xl">close</span>
              </button>
            </header>

            <div class="p-10">
              <form @submit.prevent="saveBanner" class="space-y-8">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                    <input v-model="form.title" placeholder="Ex: Summer Collection 2024" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
                  </div>

                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtext Narrative</label>
                    <input v-model="form.subtitle" placeholder="Ex: Discover our newest artisanal selections" class="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 transition-all" />
                  </div>

                  <div class="space-y-3 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Visual Asset</label>
                    <div class="relative h-60 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all group-hover:bg-white group-hover:border-primary-500/50 overflow-hidden">
                      <input type="file" @change="handleFile" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div v-if="!previewUrl" class="text-center">
                        <span class="material-icons text-4xl text-slate-300 mb-2">cloud_upload</span>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select High-Resolution Image</p>
                      </div>
                      <img v-else :src="previewUrl" class="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  </div>

                  <button type="submit" :disabled="isSaving" class="w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 transform active:scale-95">
                    {{ isSaving ? 'Authorizing Deployment...' : 'Deploy Visual Masterpiece' }}
                    <span class="material-icons text-lg">auto_fix_high</span>
                  </button>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { bannerService } from '../../services/api';
import { useToast } from '../../composables/useToast';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';

const toast = useToast();
const loading = ref(false);
const isSaving = ref(false);

const banners = ref([]);
const showModal = ref(false);
const form = ref({ title: '', subtitle: '' });
const file = ref(null);
const previewUrl = ref(null);

const fetchBanners = async () => {
    try {
      loading.value = true;
      const data = await bannerService.getAllAdmin();
      banners.value = data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
};

onMounted(fetchBanners);

const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      file.value = selectedFile;
      previewUrl.value = URL.createObjectURL(selectedFile);
    }
};

const saveBanner = async () => {
    try {
        if (!file.value) return toast.error('Visual asset required for deployment');
        
        isSaving.value = true;
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('subtitle', form.value.subtitle);
        formData.append('image', file.value);

        await bannerService.create(formData);
        toast.success('Visual masterpiece deployed successfully');
        
        showModal.value = false;
        form.value = { title: '', subtitle: '' };
        file.value = null;
        previewUrl.value = null;
        await fetchBanners();
    } catch (err) {
    } finally {
        isSaving.value = false;
    }
};

const deleteBanner = async (id) => {
    if (confirm('Authorize removal of this visual from ecosystem?')) {
        try {
            await bannerService.delete(id);
            toast.success('Visual removed from ecosystem');
            await fetchBanners();
        } catch (error) {}
    }
};
</script>

<style scoped>
.scale-enter-active, .scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
}
</style>
