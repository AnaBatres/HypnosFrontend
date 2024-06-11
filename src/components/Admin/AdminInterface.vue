<template>
    <admin-navbar />
  </template>
  
  <script>
  import axios from 'axios';
  import Cookies from 'js-cookie';
  import Swal from 'sweetalert2';
  import AdminNavbar from './AdminNavbar.vue';
  
  export default {
    name: 'Navbar',
    components: {
      AdminNavbar
    },
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
  