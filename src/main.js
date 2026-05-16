import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useTrackingStore } from './stores/useTracking'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize tracking
const trackingStore = useTrackingStore()
trackingStore.initTracking()

app.mount('#app')

// Register Service Worker for PWA - do NOT auto-reload on update (kills push subscriptions)
if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
            // Silent update: apply the new SW without destroying active push subscriptions
            // DO NOT call window.location.reload() here - it invalidates the push subscription
            updateSW(true);
        },
        onOfflineReady() {
            console.log('[SW] Offline monitoring ready');
        },
        onRegisteredSW(swUrl, registration) {
            // When internet comes back online, tell the SW to flush any queued notifications
            window.addEventListener('online', () => {
                if (registration && registration.active) {
                    registration.active.postMessage({ type: 'FLUSH_PENDING_NOTIFICATIONS' });
                }
            });
            // Register true background sync for when app is completely closed
            if ('sync' in registration) {
                registration.sync.register('flush-notifications').catch(console.error);
            }
        }
    });
}
