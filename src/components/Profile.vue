<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link to="/" class="navbar-brand">HYPNOS</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" aria-current="page"><i
                  class="bi bi-house-fill text-white"></i></router-link>
            </li>
            <li class="nav-item">
              <router-link to="/explore" class="nav-link"><i class="bi bi-compass text-white"></i></router-link>
            </li>
            <li class="nav-item">
              <router-link to="/notifications" class="nav-link"><i class="bi bi-bell text-white"></i></router-link>
            </li>
            <li class="nav-item">
              <router-link to="/create-publication" class="nav-link"><i
                  class="bi bi-cloud-upload text-white"></i></router-link>
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
                <i class="bi bi-person-circle text-white"></i> {{ user?.firstname || '' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <router-link to="/profile">
                  <li><a class="dropdown-item">Perfil</a></li>
                </router-link>
                <router-link to="/settings">
                  <li><a class="dropdown-item">Configuración</a></li>
                </router-link>
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
    <div class="profile-header">
      <div class="profile-image">
        <img :src="avatarPreviewUrl || 'https://via.placeholder.com/150'" alt="Profile Picture">
      </div>
      <div class="profile-info" v-if="user">
        <h2>{{ user?.firstname || 'Usuario' }}</h2>
        <p>{{ user?.alias || 'Alias' }}</p>
      </div>
    </div>

    <div class="container profile-content">
      <ul class="nav nav-tabs" id="profileTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="posts-tab" data-bs-toggle="tab" data-bs-target="#posts" type="button"
            role="tab" aria-controls="posts" aria-selected="true">Publicaciones</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="about-tab" data-bs-toggle="tab" data-bs-target="#about" type="button" role="tab"
            aria-controls="about" aria-selected="false">Acerca de</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button"
            role="tab" aria-controls="settings" aria-selected="false">Configuración</button>
        </li>
      </ul>

      <div class="tab-content" id="profileTabsContent">
        <div class="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
          <div v-if="publications.length === 0" class="text-center mt-4">
            <p>No hay publicaciones.</p>
          </div>
          <div v-else>
            <div v-for="post in publications" :key="post.id" class="profile-post">
              <div class="post-header">
                <img :src="'https://via.placeholder.com/50'" alt="User Picture">
                <div class="post-user" v-if="post.user">{{ post.user.alias || 'Desconocido' }}</div>
                <div class="post-date" v-if="post.createdAt">
                  {{ post.createdAt }}
                </div>
              </div>
              <div class="post-content">
                <p>{{ post.text }}</p>
              </div>
              <div class="post-actions">
                <button class="btn btn-outline-primary btn-sm"><i class="fas fa-thumbs-up"></i> Me gusta</button>
                <button class="btn btn-outline-secondary btn-sm"><i class="fas fa-comment"></i> Comentar</button>
                <button class="btn btn-outline-danger btn-sm"><i class="fas fa-share"></i> Compartir</button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="about" role="tabpanel" aria-labelledby="about-tab">
          <h4>Información Personal</h4>
          <p>Nombre: {{ user?.firstname || 'Desconocido' }}</p>
          <p>Apellido: {{ user?.lastname || 'Desconocido' }}</p>
          <p>Email: {{ user?.email || 'No disponible' }}</p>
        </div>

        <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">
          <h4>Configuración de la Cuenta</h4>
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label for="inputEmail" class="form-label">Email</label>
              <input v-model="user.email" type="email" class="form-control" id="inputEmail"
                placeholder="name@example.com">
            </div>
            <div class="mb-3">
              <label for="inputPassword" class="form-label">Contraseña</label>
              <input v-model="user.password" type="password" class="form-control" id="inputPassword"
                placeholder="Contraseña">
            </div>
            <div class="mb-3">
              <label for="inputAvatar" class="form-label">Foto de perfil</label>
              <input @change="handleFileUpload
                " type="file" class="form-control" id="inputAvatar">
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </form>
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
