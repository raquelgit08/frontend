import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

// Font Awesome CSS (optional if needed)
import '@fortawesome/fontawesome-free/css/all.css';

// Import only necessary Bootstrap JavaScript components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);

// Use BootstrapVue globally
app.use(BootstrapVue3);

// Use the router
app.use(router);

// Mount the app
app.mount('#app');
