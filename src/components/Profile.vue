<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link to="/" class="navbar-brand">Hypnos</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" aria-current="page">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/explore" class="nav-link">Explorar</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/notifications" class="nav-link">Notificaciones</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/create-publication" class="nav-link">Crear Publicación</router-link>
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
                <i class="bi bi-person-circle"></i> {{ user?.firstname || '' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <router-link to="/profile">
                  <li><a class="dropdown-item"><i class="bi bi-person-circle"></i> Perfil</a></li>
                </router-link>
                <router-link to="/settings">
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
              <!-- Pestaña de Publicaciones -->
              <div class="tab-pane fade show active" id="publications" role="tabpanel"
                aria-labelledby="publications-tab">
                <div v-if="publications.length === 0" class="text-center mt-4">
                  <p>No hay publicaciones.</p>
                </div>
                <div v-else>
                  <div v-for="post in publications" :key="post.id" class="card mb-3">
                    <div class="card-header">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <img :src="post.user?.profilePicture || 'https://via.placeholder.com/50'" alt="User Picture"
                            class="rounded-circle me-3" style="width: 50px;">
                          <div>
                            <h5 class="card-title">{{ post.user?.firstname }} {{ post.user?.lastname }}</h5>
                            <p class="card-text"><small class="text-muted">{{ post.createdAt }}</small></p>
                          </div>
                        </div>
                        <div>
                          <button class="btn btn-outline-danger"><i class="bi bi-arrow-bar-up"></i> Compartir</button>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <p class="card-text">{{ post.text }}</p>
                    </div>
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
        password: ''
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
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.avatarPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    },
    confirmLogout() {
      Cookies.remove('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.profile-image img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.profile-info {
  margin-left: 20px;
}

.profile-info h2 {
  margin: 0;
}

.profile-content {
  margin-top: 20px;
}

.profile-content {
  margin-top: 20px;
}

.profile-post {
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-header img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}

.post-user {
  font-weight: bold;
}

.post-content {
  margin-top: 10px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
