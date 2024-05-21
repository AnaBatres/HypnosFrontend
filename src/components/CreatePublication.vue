<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Red Social</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/create-publication">Publicar</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/navigate">Navegar</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Perfil</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/logout">Cerrar Sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-5">
      <h2>Subir Publicación</h2>
      <form @submit.prevent="submitPublication">
        <div class="mb-3">
          <label for="title" class="form-label">Título:</label>
          <input type="text" class="form-control" id="title" v-model="publication.title" required>
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Contenido:</label>
          <textarea class="form-control" id="content" v-model="publication.content" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Subir</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      publication: {
        title: '',
        content: ''
      }
    };
  },
  methods: {
    submitPublication() {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
          axios.post('http://localhost:8080/api/publications', {
            title: this.publication.title,
            content: this.publication.content
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log('Publicación subida:', response.data);
            alert('Publicación subida exitosamente!');
            // Limpiar el formulario después de la subida exitosa
            this.publication.title = '';
            this.publication.content = '';
          })
          .catch(error => {
            console.error('Error al subir la publicación:', error);
            alert('Hubo un error al subir la publicación. Por favor, inténtalo de nuevo.');
          });
        }
      } catch (error) {
        console.error('Error al subir la publicación:', error);
        alert('Hubo un error al subir la publicación. Por favor, inténtalo de nuevo.');
      }
    }
  }
};
</script>


<style scoped>
/* Estilos específicos para este componente */
</style>
