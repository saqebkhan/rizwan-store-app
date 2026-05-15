import { defineStore } from 'pinia';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://rizwan-store-api.onrender.com') + '/api';

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    visitorId: localStorage.getItem('visitorId') || '',
    sessionId: null,
    startTime: null,
    heartbeatInterval: null,
  }),
  actions: {
    initTracking() {
      if (!this.visitorId) {
        this.visitorId = uuidv4();
        localStorage.setItem('visitorId', this.visitorId);
      }
      this.startSession();
    },
    async startSession() {
      try {
        const deviceInfo = {
          visitorId: this.visitorId,
          deviceType: this.getDeviceType(),
          browser: this.getBrowser(),
          os: navigator.platform,
          source: document.referrer || 'direct'
        };
        const res = await axios.post(`${API_BASE}/sessions/start`, deviceInfo);
        this.sessionId = res.data._id;
        this.startTime = new Date();
        
        // Start heartbeat every 3 minutes
        this.heartbeatInterval = setInterval(() => {
          this.trackPage(window.location.pathname);
        }, 3 * 60 * 1000);
      } catch (error) {
        console.error('Tracking Error:', error);
      }
    },
    async trackPage(path) {
      try {
        await axios.post(`${API_BASE}/sessions/update`, {
          visitorId: this.visitorId,
          path: path
        });
      } catch (error) {
        console.error('Tracking Error:', error);
      }
    },
    async trackProductView(productId) {
      try {
        await axios.post(`${API_BASE}/sessions/update`, {
          visitorId: this.visitorId,
          productId: productId
        });
      } catch (error) {
        console.error('Tracking Error:', error);
      }
    },
    getDeviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
      return "desktop";
    },
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Safari")) return "Safari";
        if (ua.includes("Edge")) return "Edge";
        return "Unknown";
    }
  }
});
