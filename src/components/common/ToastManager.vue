<template>
  <div class="fixed bottom-32 md:bottom-12 left-1/2 -translate-x-1/2 z-[9999] flex flex-col space-y-3 w-[calc(100%-3rem)] max-w-md pointer-events-none">
    <TransitionGroup 
      name="toast"
      enter-active-class="transform ease-out duration-500 transition"
      enter-from-class="translate-y-10 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center p-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border backdrop-blur-2xl bg-slate-950/95 text-white overflow-hidden relative group"
        :class="[
          toast.type === 'success' ? 'border-green-500/30' : 
          toast.type === 'error' ? 'border-primary-500/30' : 
          toast.type === 'warning' ? 'border-amber-500/30' : 
          'border-blue-500/30'
        ]"
      >
        <!-- Status Indicator Strip -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="[
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-primary-500' : 
          toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
        ]"></div>

        <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4" :class="[
          toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 
          toast.type === 'error' ? 'bg-primary-500/10 text-primary-500' : 
          toast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
        ]">
          <span class="material-icons text-xl">
            {{ 
              toast.type === 'success' ? 'verified' : 
              toast.type === 'error' ? 'gpp_maybe' : 
              toast.type === 'warning' ? 'report_problem' : 'info' 
            }}
          </span>
        </div>

        <div class="flex-grow">
          <div class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">Ecosystem Update</div>
          <div class="text-xs font-black tracking-wide leading-tight">{{ toast.message }}</div>
        </div>

        <button @click="removeToast(toast.id)" class="ml-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <span class="material-icons text-sm">close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-move {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
