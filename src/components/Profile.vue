<template>
  <div>
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
              <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> {{ user?.firstname || '' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <router-link to="/profile" class="router-link-custom">
                  <li><a class="dropdown-item"><i class="bi bi-person-circle"></i> Perfil</a></li>
                </router-link>
                <router-link to="/settings" class="router-link-custom">
                  <li><a class="dropdown-item"><i class="bi bi-gear"></i> Configuración</a></li>
                </router-link>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#S" @click="confirmLogout"><i class="bi bi-box-arrow-right"></i>
                    Cerrar sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <img :src="avatarPreviewUrl || 'https://via.placeholder.com/150'" alt="Profile Picture"
                class="rounded-circle mb-3">
              <h5 class="card-title">{{ user?.firstname || 'Usuario' }}</h5>
              <p class="card-text">{{ user?.alias || 'Alias' }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a class="nav-link active" href="#">Publicaciones</a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="tab-pane fade show active" id="publications" role="tabpanel"
                aria-labelledby="publications-tab">
                <div v-if="publications.length === 0" class="text-center mt-4">
                  <p>No hay publicaciones.</p>
                </div>
                <div v-else>
                  <div v-for="post in publications" :key="post.id" class="card mb-3">
                    <router-link :to="'/publication/' + post.id" class="text-decoration-none">
                      <div class="card-header">
                        <h5 class="card-title text-center">
                          {{ post.title }}
                        </h5>
                        <div class="d-flex justify-content-center mt-3">
                          <button class="btn btn-outline-danger btn-sm me-2"><i class="bi bi-arrow-bar-up"></i>
                            Compartir</button>
                          <router-link :to="'/edit-publication/' + post.id"
                            class="btn btn-outline-danger btn-sm me-2">Editar</router-link>
                          <button class="btn btn-danger btn-sm me-2" @click="deletePost(post.id)">Eliminar</button>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { RouterLink } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'Profile',
  data() {
    return {
      user: {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        alias: '',
        password: '',
        search: ''
      },
      avatarPreviewUrl: '',
      publications: [],
      selectedFile: null
    };
  },
  async created() {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const userData = response.data;
        console.log(userData);

        // Asignar datos del usuario
        this.user = {
          id: userData.id,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          alias: userData.alias,
          password: ''  // Mantener la contraseña vacía en esta instancia
        };

        // Asignar publicaciones del usuario
        this.publications = userData.publications;

        // Obtener información detallada de cada publicación
        await Promise.all(this.publications.map(async (post) => {
          const postId = post.id;
          const postResponse = await axios.get(`http://localhost:8080/api/publications/id/${postId}`);
          const updatedPost = postResponse.data;
          post.likes = updatedPost.likedByUsers;
          post.comments = updatedPost.comments;
          post.categories = updatedPost.categories;
          post.title = updatedPost.title;
        }));
      } else {
        console.error('No se encontró el token en la cookie.');
        this.$router.push('/login');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      if (error.response && error.response.status === 401) {
        this.$router.push('/login');
      } else {
        alert('Error al cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  },
  methods: {
    async updateProfile() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const userId = this.user.id;
          const formData = new FormData();
          formData.append('email', this.user.email);
          if (this.user.password) {
            formData.append('password', this.user.password);
          }
          if (this.selectedFile) {
            formData.append('avatar', this.selectedFile);
          }

          const response = await axios.put(`http://localhost:8080/api/users/id/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          this.user = response.data;
          alert('Perfil actualizado exitosamente');
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
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
    async redirectToUserProfile() {
      if (this.user.search.trim() !== '') {
        this.searchUserByAlias();
      }
    },
    async deletePost(postId) {
      if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
        try {
          const token = Cookies.get('token');
          if (token) {
            await axios.delete(`http://localhost:8080/api/publications/${postId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            // Eliminar la publicación del array de publicaciones
            this.publications = this.publications.filter(post => post.id !== postId);
          } else {
            console.error('No se encontró el token en la cookie.');
          }
        } catch (error) {
          console.error('Error al eliminar la publicación:', error);
          alert('Error al eliminar la publicación. Por favor, inténtalo de nuevo más tarde.');
        }
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.avatarPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
};
</script>

<style scoped></style>