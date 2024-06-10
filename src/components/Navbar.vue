<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand text-light">HYPNOS</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto align-items-center">
          <li class="nav-item">
            <router-link to="/exploreFriends" class="nav-link text-light" aria-current="page">
              <i class="bi bi-house-door-fill icon"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/explore" class="nav-link text-light">
              <i class="bi bi-compass-fill icon"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/create-publication" class="nav-link text-light">
              <i class="bi bi-pencil-square icon"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/favorites" class="nav-link text-light">
              <i class="bi bi-heart-fill icon"></i>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              Categorias
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-for="category in dreamCategories" :key="category.id">
                <router-link :to="'/publications/' + category.id" class="dropdown-item no-underline">{{ category.name
                  }}</router-link>
              </li>
            </ul>
          </li>
        </ul>

        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" v-model="user.search">
          <button class="btn btn-outline-light" type="button" @click="redirectToUserProfile">
            <i class="bi bi-search icon"></i>
          </button>
        </form>

        <ul class="navbar-nav ms-3 align-items-center">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-circle icon"></i> {{ user?.firstname || '' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <router-link to="/profile" class="router-link-custom no-underline">
                <li><a class="dropdown-item"><i class="bi bi-person-circle icon"></i> Perfil</a></li>
              </router-link>
              <router-link to="/settings" class="router-link-custom no-underline">
                <li><a class="dropdown-item"><i class="bi bi-gear icon"></i> Configuración</a></li>
              </router-link>
              <li>
                <hr class="dropdown-divider">
              </li>
              <button class="dropdown-item" @click="confirmLogout"><i class="bi bi-box-arrow-right icon"></i>
                Cerrar sesión</button>
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
import Swal from 'sweetalert2';

export default {
  name: 'Navbar',
  data() {
    return {
      user: {
        search: '',
        firstname: '',
      },
      dreamCategories: []
    };
  },
  async created() {
    this.fetchDreamCategories();
    this.fetchUserData();
  },
  methods: {
    async fetchDreamCategories() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/api/categories', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.dreamCategories = response.data;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener las categorías de sueños:', error);
      }
    },
    async fetchUserData() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/api/profile/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.user.firstname = response.data.firstname;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    async searchUserByAlias() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get(`http://localhost:8080/api/users/@${this.user.search}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userData = response.data;
          if (userData.id) {
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
    async redirectToUserProfile() {
      if (this.user.search.trim() !== '') {
        this.searchUserByAlias();
      }
    },
    async confirmLogout() {
      const confirmation = await Swal.fire({
        title: '¿Estás seguro de que deseas cerrar sesión?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        icon: 'warning',
        reverseButtons: true
      });

      if (confirmation.isConfirmed) {
        this.logout();
      }
    },
    async logout() {
      try {
        const token = Cookies.get('token');

        if (token) {
        
          Cookies.remove('token');

        
          this.$router.push('/login');
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  }
};
</script>

<style scoped>
.icon {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.no-underline {
  text-decoration: none;
}
</style>
