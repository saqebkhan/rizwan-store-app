import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref(JSON.parse(localStorage.getItem('wishlist') || '[]'));

    const toggleWishlist = (product) => {
        const index = items.value.findIndex(i => i._id === product._id);
        if (index > -1) {
            items.value.splice(index, 1);
        } else {
            items.value.push(product);
        }
        localStorage.setItem('wishlist', JSON.stringify(items.value));
    };

    const isInWishlist = (productId) => {
        return items.value.some(i => i._id === productId);
    };

    const totalItems = computed(() => items.value.length);

    return {
        items,
        toggleWishlist,
        isInWishlist,
        totalItems
    };
});
