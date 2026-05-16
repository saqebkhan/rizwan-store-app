import { defineStore } from 'pinia';

function setAdminInIDB(isAdmin) {
    try {
        const request = indexedDB.open('AdminStore', 1);
        request.onupgradeneeded = (e) => e.target.result.createObjectStore('auth');
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('auth', 'readwrite');
            tx.objectStore('auth').put(isAdmin, 'isAdmin');
        };
    } catch (err) {}
}

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
        setAdminInIDB(true);
        return true;
      }
      return false;
    },
    logout() {
      this.isAdmin = false;
      this.adminData = null;
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminData');
      setAdminInIDB(false);
    }
  }
});
