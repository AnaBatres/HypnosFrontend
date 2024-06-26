import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Cookies from 'js-cookie';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

// Componentes
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Profile from './components/Profile.vue';
import CreatePublication from './components/CreatePublication.vue'; 
import UserSettings from './components/UserSettings.vue';
import ExploreFriends from './components/ExploreFriends.vue';
import Explore from './components/Explore.vue';
import PublicationDetail from './components/PublicationDetail.vue';
import UserProfile from './components/UserProfile.vue';
import PublicationsByCategory from './components/PublicationsByCategory.vue';
import ExploreByCategories from './components/ExploreByCategories.vue';
import AllUsers from './components/Admin/AllUsers.vue';
import AllPublications from './components/Admin/AllPublications.vue';
import AllCategories from './components/Admin/AllCategories.vue';
import Favorites from './components/Favorites.vue';
import EditCategory from './components/Admin/EditCategory.vue';
import AddCategory from './components/Admin/AddCategory.vue';

// Rutas
const routes = [
  { path: '/', component: Register },
  { path: '/login', component: Login },
  { path: '/settings', component: UserSettings},
  { path: '/exploreFriends', component: ExploreFriends},
  { path: '/explore', component: Explore },
  { path: '/publication/:id', name: 'PublicationDetail', component: PublicationDetail },
  { path: '/exploreByCategories', component: ExploreByCategories },
  { path: '/allUsers', component: AllUsers },
  { path: '/allPublications', component: AllPublications },
  { path: '/allCategories', component: AllCategories },
  { path: '/favorites', component: Favorites },
  { path: '/addCategory', component: AddCategory },
  {
    path: '/edit-category/:id ', 
    name: 'editCategory',
    component: EditCategory
  },
  {
    path: '/profile/:alias', 
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/publications/:categoryId',
    component: PublicationsByCategory,
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/create-publication', 
    component: CreatePublication,
    meta: { requiresAuth: true } 
  }
];

// Creación de instancia de enrutador
const router = createRouter({
  history: createWebHashHistory(),
  routes
});


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

library.add(faGhost);

const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
