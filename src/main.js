import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useTrackingStore } from './stores/useTracking'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize tracking
const trackingStore = useTrackingStore()
trackingStore.initTracking()

app.mount('#app')
