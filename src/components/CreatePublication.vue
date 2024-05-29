<template>
  <div>
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
              <a class="nav-link" aria-current="page" href="#"><i class="bi bi-house-fill text-white"></i></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#"><i class="bi bi-compass text-white"></i></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#"><i class="bi bi-bell text-white"></i></a>
            </li>
            <li class="nav-item">
              <router-link to="/create-publication" class="nav-link"><i class="bi bi-cloud-upload text-white"></i></router-link>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
            <button class="btn btn-outline-light" type="submit">Buscar</button>
          </form>
          <ul class="navbar-nav ms-3">
            <li class="nav-item dropdown" v-if="user">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi bi-person-circle text-white"></i> {{ user.alias }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <router-link to="/profile">
                  <li><a class="dropdown-item">Perfil</a></li>
                </router-link>
                <li><a class="dropdown-item" href="#">Configuración</a></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#" @click="confirmLogout">Cerrar sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="create-post card my-4">
        <div class="card-header bg-primary text-white">
          Crear Publicación
        </div>
        <div class="card-body">
          <form @submit.prevent="submitPost">
            <div class="mb-3">
              <label for="postContent" class="form-label">Contenido</label>
              <textarea v-model="newPost.text" class="form-control" id="postContent" rows="5"
                placeholder="Escribe aquí el contenido de tu publicación"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Publicar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';

export default {
  data() {
    return {
      newPost: {
        text: ''
      },
      userId: null
    };
  },
  created() {
    // When the component is created, fetch the user ID
    this.fetchUserId();
  },
  methods: {
    submitPost() {
      if (!this.userId) {
        console.error("Error: No se pudo obtener el ID del usuario del token JWT.");
        return;
      }

      const postData = {
        userId: this.userId,
        text: this.newPost.text
      };

      axios.post('http://localhost:8080/api/publications/create', postData)
        .then(response => {
          console.log('Publicación creada exitosamente:', response.data);
          alert('Publicación creada exitosamente!');
          this.clearForm();
        })
        .catch(error => {
          console.error('Error al crear la publicación:', error);
          alert('Error al crear la publicación. Por favor, inténtalo de nuevo más tarde.');
        });
    },
    fetchUserId() {
      const token = Cookies.get('token');
      if (!token) {
        console.error("Error: No se encontró el token JWT en la cookie.");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userAlias = payload.alias;
        axios.get(`http://localhost:8080/api/users/@${userAlias}`)
          .then(response => {
            this.userId = response.data.id;
          })
          .catch(error => {
            console.error('Error al obtener el ID del usuario:', error);
          });
      } catch (error) {
        console.error("Error al decodificar el token JWT:", error);
      }
    },
    clearForm() {
      this.newPost.text = '';
    }
  }
};

</script>

<style>
/* Estilos CSS */
</style>
