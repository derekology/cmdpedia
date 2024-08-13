import '@/assets/main.css';
import "vue-toastification/dist/index.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';
import Toast, { POSITION } from "vue-toastification";

import type { PluginOptions } from "vue-toastification";

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);
const head = createHead()
const toastOptions: PluginOptions = {
    position: POSITION.TOP_CENTER,
    timeout: 1000,
    transition: 'Vue-Toastification__fade',
    maxToasts: 5,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.7,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
    rtl: false,
    toastClassName: 'toast'
}

app.use(createPinia());
app.use(Toast, toastOptions);
app.use(router);
app.use(head);

app.mount('#app');
