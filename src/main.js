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

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    registerSW({
        immediate: true,
        onNeedRefresh() {
            // Display system update notice
            console.log('Ecosystem update detected - refreshing SW');
            window.location.reload();
        },
        onOfflineReady() {
            console.log('Ecosystem offline monitoring ready')
        }
    })
}
