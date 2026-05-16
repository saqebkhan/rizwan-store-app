import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useTrackingStore } from './stores/useTracking'
import { registerSW } from 'virtual:pwa-register'
import { useToast } from './composables/useToast'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize tracking
const trackingStore = useTrackingStore()
trackingStore.initTracking()

app.mount('#app')

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    registerSW({
        immediate: true,
        onNeedRefresh() {
            const toast = useToast();
            toast.info('System update available. Refreshing...');
            setTimeout(() => window.location.reload(), 1500);
        },
        onOfflineReady() {
            console.log('Ecosystem offline monitoring ready')
        }
    })
}
