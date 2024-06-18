<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand text-light">HYPNOS</router-link>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto align-items-center">
          <li class="nav-item">
            <router-link to="/allUsers" class="nav-link text-light" aria-current="page">
              <i class="bi bi-file-earmark-person-fill"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/allPublications" class="nav-link text-light">
              <i class="bi bi-folder-fill"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/allCategories" class="nav-link text-light">
              <i class="bi bi-database-add"></i>
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-3 align-items-center">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-circle icon"></i> Admin: {{ user?.firstname || '' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
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
import Swal from 'sweetalert2';
import axiosInstance from '../../axiosConfig';
import Cookies from 'js-cookie';

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
        const response = await axiosInstance.get('api/categories');
        this.dreamCategories = response.data;
      } catch (error) {
        console.error('Error al obtener las categorías de sueños:', error);
      }
    },
    async fetchUserData() {
      try {
        const response = await axiosInstance.get('/profile/me');
        this.user.firstname = response.data.firstname;
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
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