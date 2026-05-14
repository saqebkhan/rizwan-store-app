import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
  },
  actions: {
    addToCart(product, quantity = 1) {
      const existing = this.items.find(item => item._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ ...product, quantity });
      }
      this.save();
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item._id !== productId);
      this.save();
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item._id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        this.save();
      }
    },
    clearCart() {
      this.items = [];
      this.save();
    },
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }
});
