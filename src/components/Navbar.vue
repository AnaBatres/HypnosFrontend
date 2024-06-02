<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand text-light">HYPNOS</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link text-light" aria-current="page">
              <i class="bi bi-house-door-fill" style="color: white;"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/explore" class="nav-link text-light">
              <i class="bi bi-compass-fill" style="color: white;"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/notifications" class="nav-link text-light">
              <i class="bi bi-bell-fill" style="color: white;"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/create-publication" class="nav-link text-light">
              <i class="bi bi-pencil-square" style="color: white;"></i>
            </router-link>
          </li>
        </ul>

        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
                 v-model="user.search">
          <button class="btn btn-outline-light" type="button" v-on:click="redirectToUserProfile">
            <i class="bi bi-search"></i>
          </button>
        </form>

        <ul class="navbar-nav ms-3">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle text-white"></i> {{ user.firstname }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <router-link to="/profile">
                <li><a class="dropdown-item"><i class="bi bi-person-circle"></i> Perfil</a></li>
              </router-link>
              <router-link to="/settings">
                <li><a class="dropdown-item"><i class="bi bi-gear"></i> Configuración</a></li>
              </router-link>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#" @click="confirmLogout"><i class="bi bi-box-arrow-right"></i>
                  Cerrar sesión</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { RouterLink } from 'vue-router';
import UserData from './UserData.vue';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'Navbar',
  components: {
    RouterLink,
    UserData
  },
  data() {
    return {
      user: {
        search: '',
        firstname: '' // Puedes cambiar esto por el nombre del usuario real
      }
    };
  },
  methods: {
    async redirectToUserProfile() {
      if (this.user.search.trim() !== '') {
        this.searchUserByAlias();
      }
    },
    async searchUserByAlias() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get(`http://localhost:8080/api/users/@${this.user.search}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const userData = response.data;
          if (userData.id) {
            // Redirigir al perfil del usuario encontrado
            this.$router.push(`/profile/${userData.alias}`);
          } else {
            alert('Usuario no encontrado.');
          }
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al buscar el usuario por alias:', error);
        alert('Error al buscar el usuario por alias. Por favor, inténtalo de nuevo más tarde.');
      }
    },
    async confirmLogout() {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        this.logout();
      }
    },
    async logout() {
      try {
        // Realizar la llamada para cerrar sesión, eliminar la cookie, etc.
        console.log('Cerrando sesión...');
        // Simplemente redirigir a la página de inicio de sesión por ahora
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente */
</style>
