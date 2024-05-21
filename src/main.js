import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componentes
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';
import CreatePublication from './components/CreatePublication.vue'; 

// Rutas
const routes = [
  { path: '/', component: Register },
  { path: '/login', component: Login },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/create-publication', 
    component: CreatePublication,
    meta: { requiresAuth: true } 
  },
];

// Creación de instancia de enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

// Creación de la aplicación de Vue y uso del enrutador
const app = createApp(App);
app.use(router);
app.mount('#app');
