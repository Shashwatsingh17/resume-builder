import './assets/main.css'
import 'primevue/resources/themes/aura-dark-purple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')
