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
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
            <button class="btn btn-outline-light" type="submit"><i class="bi bi-search"></i></button>
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
                <li><a class="dropdown-item" href="#" @click="confirmLogout"><i class="bi bi-box-arrow-right"></i>
                    Cerrar sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4 d-flex justify-content-center">
      <div class="publication-card p-4 shadow-sm">
        <div v-if="!publication">
          <p>Cargando...</p>
        </div>
        <div v-else>
          <h1 class="publication-title">{{ publication.title }}</h1>
          <p>{{ publication.text }}</p>
          <div>
            <span v-for="(category, index) in publication.categories" :key="index"
              class="badge bg-secondary me-1">{{ category.name }}</span>
          </div>

          <!-- Comentarios -->
          <div v-if="!isOwner">
            <!-- Cuadro de comentario -->
            <div class="mt-4">
              <textarea class="form-control" rows="3" v-model="newComment"></textarea>
              <button class="btn btn-primary mt-2" @click="commentOnPublication">Comentar</button>
            </div>

            <!-- Botón de "Me gusta" -->
            <div class="mt-3">
              <button @click="likePublication">Me gusta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PublicationDetail',
  data() {
    return {
      publication: null,
      currentUser: null,
      isOwner: false,
      isLiked: false,
      newComment: ''
    };
  },
  async created() {
    const postId = this.$route.params.id;
    try {
      // Obtener la publicación
      const publicationResponse = await axios.get(`http://localhost:8080/api/publications/id/${postId}`);
      this.publication = publicationResponse.data;

      // Obtener los datos del usuario actual
      const userResponse = await axios.get('http://localhost:8080/api/profile/me', {
        headers: {
          Authorization: `Bearer ${this.getCookie('token')}`
        }
      });
      this.currentUser = userResponse.data;

      // Verificar si el usuario actual es el propietario de la publicación
      if (this.currentUser && this.currentUser.id) {
        this.isOwner = this.publication.user.id === this.currentUser.id;
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  },
  methods: {
    // Función para obtener el valor de la cookie por su nombre
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
    likePublication() {
      if (!this.isOwner) {
        axios.post(`http://localhost:8080/api/publications/${this.publication.id}/like`)
          .then(response => {
            this.isLiked = !this.isLiked;
            console.log('Publicación likeada');
          })
          .catch(error => {
            console.error('Error al dar "me gusta" a la publicación:', error);
          });
      }
    },
    commentOnPublication() {
      if (!this.isOwner) {
        axios.post(`http://localhost:8080/api/publications/${this.publication.id}/comments`, {
          text: this.newComment
        })
        .then(response => {
          // Agregar el nuevo comentario a la lista de comentarios
          this.publication.comments.push(response.data);
          // Limpiar el campo de texto del comentario
          this.newComment = '';
        })
        .catch(error => {
          console.error('Error al comentar en la publicación:', error);
        });
      }
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.publication-card {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mt-4 {
  margin-top: 1.5rem;
}

.p-4 {
  padding: 1.5rem;
}

.publication-title {
  font-size: 2.5rem;
  color: #007bff;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.comment-section textarea {
  width: 100%;
}

.comment-section button {
  display: block;
  width: 100%;
}

.comments {
  margin-top: 2rem;
}

.comment {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.text-danger {
  color: #dc3545;
}

.heart-icon {
  font-size: 1.5rem;
  color: red;
  cursor: pointer;
}
</style>
