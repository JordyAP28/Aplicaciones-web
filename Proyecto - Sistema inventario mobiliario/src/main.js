import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Estilos globales
import './assets/css/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')