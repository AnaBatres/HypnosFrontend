import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Cookies from 'js-cookie';


// Componentes
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';
import CreatePublication from './components/CreatePublication.vue'; 
import UserSettings from './components/UserSettings.vue';
import Index from './components/Index.vue';
import EditPublication from './components/EditPublication.vue';


// Rutas
const routes = [
  { path: '/', component: Register },
  { path: '/login', component: Login },
  { path: '/settings', component: UserSettings},
  { path: '/index', component: Index},
  { path: '/edit-publication/:id', component: EditPublication },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true } // Ruta protegida, requiere autenticación
  },
  { 
    path: '/create-publication', 
    component: CreatePublication,
    meta: { requiresAuth: true } // Ruta protegida, requiere autenticación
  }
];

// Creación de instancia de enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = Cookies.get('token');
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
