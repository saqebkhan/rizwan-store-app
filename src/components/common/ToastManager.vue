<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col space-y-2 w-full max-w-sm pointer-events-none">
    <TransitionGroup 
      name="toast"
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-md"
        :class="[
          toast.type === 'success' ? 'bg-green-50/90 border-green-100 text-green-800' : 
          toast.type === 'error' ? 'bg-red-50/90 border-red-100 text-red-800' : 
          toast.type === 'warning' ? 'bg-amber-50/90 border-amber-100 text-amber-800' : 
          'bg-blue-50/90 border-blue-100 text-blue-800'
        ]"
      >
        <span class="material-icons mr-3">
          {{ 
            toast.type === 'success' ? 'check_circle' : 
            toast.type === 'error' ? 'error' : 
            toast.type === 'warning' ? 'warning' : 'info' 
          }}
        </span>
        <div class="text-sm font-medium">{{ toast.message }}</div>
        <button @click="removeToast(toast.id)" class="ml-auto hover:opacity-70 transition">
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
  transition: all 0.3s ease;
}
</style>
