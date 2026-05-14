import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    adminData: JSON.parse(localStorage.getItem('adminData')) || null,
  }),
  actions: {
    // Simple admin login - in production this would verify with backend
    login(password) {
      if (password === 'admin123') { // Hardcoded for demo
        this.isAdmin = true;
        this.adminData = { name: 'Admin User', role: 'Owner' };
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminData', JSON.stringify(this.adminData));
        return true;
      }
      return false;
    },
    logout() {
      this.isAdmin = false;
      this.adminData = null;
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminData');
    }
  }
});
