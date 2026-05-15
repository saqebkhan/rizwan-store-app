<template>
  <div 
    v-if="show"
    :class="[
      'flex justify-center items-center',
      overlay ? 'fixed inset-0 z-50 bg-white/70 backdrop-blur-sm' : 'p-8'
    ]"
  >
    <div 
      class="animate-spin rounded-full border-t-2 border-b-2 border-primary-600"
      :class="sizeClass"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
});

const sizeClass = computed(() => {
  switch(props.size) {
    case 'sm': return 'h-6 w-6';
    case 'lg': return 'h-16 w-16 border-t-4 border-b-4';
    case 'md':
    default: return 'h-10 w-10';
  }
});
</script>
