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
            <RouterLink to="/create-publication">
              <li class="nav-item">
                <a class="nav-link"><i class="bi bi-cloud-upload text-white"></i></a>
              </li>
            </RouterLink>
          </ul>
          <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
            <button class="btn btn-outline-light" type="submit">Buscar</button>
          </form>
          <ul class="navbar-nav ms-3">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi bi-person-circle text-white"></i> Usuario
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <RouterLink to="/profile">
                  <li><a class="dropdown-item">Perfil</a></li>
                </RouterLink>
                <li><a class="dropdown-item" href="#">Configuración</a></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
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
              <label for="postTitle" class="form-label">Título</label>
              <input v-model="newPost.title" type="text" class="form-control" id="postTitle"
                placeholder="Título de la publicación">
            </div>
            <div class="mb-3">
              <label for="postDescription" class="form-label">Descripción Breve</label>
              <input v-model="newPost.description" type="text" class="form-control" id="postDescription"
                placeholder="Breve descripción">
            </div>
            <div class="mb-3">
              <label for="postContent" class="form-label">Contenido</label>
              <textarea v-model="newPost.content" class="form-control" id="postContent" rows="5"
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

export default {
  data() {
    return {
      newPost: {
        title: '',
        description: '',
        content: ''
      }
    };
  },
  methods: {
    submitPost() {
      const userId = this.getUserIdFromToken(); // Obtener el ID del usuario del token JWT almacenado en la cookie
      if (!userId) {
        console.error("Error: No se pudo obtener el ID del usuario del token JWT.");
        return;
      }

      const postData = {
        userId: userId,
        title: this.newPost.title,
        description: this.newPost.description,
        content: this.newPost.content
      };

      // Aquí podrías enviar los datos de la publicación al servidor
      console.log('Publicación creada:', postData);
      alert('Publicación creada exitosamente!');
      this.clearForm();
    },
    getUserIdFromToken() {
      const token = Cookies.get('token'); // Obtener el token JWT de la cookie
      if (!token) {
        console.error("Error: No se encontró el token JWT en la cookie.");
        return null;
      }

      try {
        // Decodificar el token JWT para obtener el payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Retornar el ID del usuario del payload
        return payload.userId;
      } catch (error) {
        console.error("Error al decodificar el token JWT:", error);
        return null;
      }
    },
    clearForm() {
      this.newPost.title = '';
      this.newPost.description = '';
      this.newPost.content = '';
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  }
};
</script>


<style>
.dropdown-item {
  text-decoration: none;
}

.create-post {
  max-width: 600px;
  margin: auto;
}

.card-header {
  font-weight: bold;
}
</style>