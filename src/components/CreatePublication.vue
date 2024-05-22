<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">
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
              <RouterLink to="/profile"><li><a class="dropdown-item">Perfil</a></li></RouterLink>
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


  <div class="create-post card my-4">
    <div class="card-header bg-primary text-white">
      Crear Publicación
    </div>
    <div class="card-body">
      <form @submit.prevent="submitPost">
        <div class="mb-3">
          <label for="postContent" class="form-label">Contenido</label>
          <textarea v-model="newPost.content" class="form-control" id="postContent" rows="3"
            placeholder="¿Qué estás pensando?"></textarea>
        </div>
        <div class="mb-3">
          <label for="postImage" class="form-label">Agregar Imagen</label>
          <input @change="handleImageUpload" type="file" class="form-control" id="postImage">
        </div>
        <div v-if="imagePreviewUrl" class="mb-3">
          <img :src="imagePreviewUrl" alt="Image Preview" class="img-fluid">
        </div>
        <button type="submit" class="btn btn-primary">Publicar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPost: {
        content: '',
        image: null
      },
      imagePreviewUrl: ''
    };
  },
  methods: {
    submitPost() {
      // Aquí podrías enviar los datos de la publicación a tu API
      console.log('Publicación creada:', this.newPost);
      alert('Publicación creada exitosamente!');
      this.clearForm();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newPost.image = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    },
    clearForm() {
      this.newPost.content = '';
      this.newPost.image = null;
      this.imagePreviewUrl = '';
    }
  }
};
</script>

<style scoped>
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

.img-fluid {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 10px;
}
</style>
