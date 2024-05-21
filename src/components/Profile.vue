<template>
  <div>
    <!-- Navbar de la red social -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">HYPNOS</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="#">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Explorar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Notificaciones</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Mensajes</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
            <button class="btn btn-outline-light" type="submit">Buscar</button>
          </form>
          <ul class="navbar-nav ms-3">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi bi-person-circle"></i> Usuario
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Perfil</a></li>
                <li><a class="dropdown-item" href="#">Configuración</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido del perfil -->
    <div class="container mt-5" v-if="user">
      <div class="row">
        <div class="col-md-4">
          <img :src="avatarPreviewUrl || user.avatarUrl" alt="Avatar" class="img-fluid rounded-circle mb-3">
          <input type="file" @change="handleFileUpload">
          <button @click="setAsProfilePic" class="btn btn-primary mt-2">Establecer como foto de perfil</button>
        </div>
        <div class="col-md-8">
          <h1>{{ user.username }}</h1>
          <p>{{ user.bio }}</p>
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico:</label>
              <input type="email" class="form-control" id="email" v-model="user.email" required>
            </div>
            <div class="mb-3">
              <label for="bio" class="form-label">Biografía:</label>
              <textarea class="form-control" id="bio" v-model="user.bio" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label for="avatarUrl" class="form-label">URL del avatar:</label>
              <input type="text" class="form-control" id="avatarUrl" v-model="user.avatarUrl">
            </div>
            <button type="submit" class="btn btn-primary">Actualizar perfil</button>
          </form>

          <!-- Mostrar publicaciones del usuario -->
          <div v-if="publications.length > 0">
            <h2>Publicaciones:</h2>
            <div v-for="publication in publications" :key="publication.id">
              <h3>{{ publication.title }}</h3>
              <p>{{ publication.content }}</p>
            </div>
          </div>
          <div v-else>
            <p>No hay publicaciones aún.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      avatar: null,
      avatarPreviewUrl: '',
      publications: []
    };
  },
  mounted() {
    this.fetchUser();
    this.fetchPublications();
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/api/profile/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.user = response.data;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async fetchPublications() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/api/publications/by-user/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.publications = response.data;
        }
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    },
    async updateProfile() {
      try {
        const formData = new FormData();
        formData.append('email', this.user.email);
        formData.append('bio', this.user.bio);
        formData.append('avatar', this.avatar);

        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.put('http://localhost:8080/api/profile/me', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          this.user = response.data;
          alert('Perfil actualizado exitosamente!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.avatar = file;
      this.avatarPreviewUrl = URL.createObjectURL(file);
    },
    async setAsProfilePic() {
      try {
        const formData = new FormData();
        formData.append('avatar', this.avatar);

        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.put('http://localhost:8080/api/profile/avatar', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          this.user.avatarUrl = response.data.avatarUrl;
          alert('Foto de perfil actualizada exitosamente!');
        }
      } catch (error) {
        console.error('Error setting profile picture:', error);
      }
    }
  }
};
</script>
