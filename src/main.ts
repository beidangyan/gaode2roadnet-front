import { createApp } from 'vue'
import App from './App.vue'
import Gaode from '@/components/static/config'

window._AMapSecurityConfig = Gaode.securityJsCode;

createApp(App).mount('#app')
