import { createApp } from 'vue'
import 'devextreme/dist/css/dx.fluent.saas.dark.css';
import './style.css'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'
const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app')
