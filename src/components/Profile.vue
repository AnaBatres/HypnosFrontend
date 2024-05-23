<template>
  <div>
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
                <i class="bi bi-person-circle text-white"></i> {{ user.firstname }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <RouterLink to="/profile">
                  <li><a class="dropdown-item">Perfil</a></li>
                </RouterLink>
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

    <div class="profile-header">
      <div class="profile-image">
        <img :src="avatarPreviewUrl || user.avatarUrl || 'https://via.placeholder.com/150'" alt="Profile Picture">
      </div>
      <div class="profile-info">
        <h2>{{ user.firstname }}</h2>
        <p>{{ '@' + user.username }}</p>
      </div>
    </div>

    <div class="container profile-content">
      <ul class="nav nav-tabs" id="profileTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="posts-tab" data-bs-toggle="tab" data-bs-target="#posts" type="button"
            role="tab" aria-controls="posts" aria-selected="true">Publicaciones</button>
          <UserPublications :userId="user.id" />
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
          <div v-for="post in publications" :key="post.id" class="profile-post">
            <div class="post-header">
              <img :src="user.avatarUrl" alt="User Picture">
              <div class="post-user">{{ user.alias }}</div>
              <div class="post-date">{{ post.date }}</div>
            </div>

            <div class="post-content">
              <p>{{ post.content }}</p>
            </div>
            <div class="post-actions">
              <button class="btn btn-outline-primary btn-sm"><i class="fas fa-thumbs-up"></i> Me gusta</button>
              <button class="btn btn-outline-secondary btn-sm"><i class="fas fa-comment"></i> Comentar</button>
              <button class="btn btn-outline-danger btn-sm"><i class="fas fa-share"></i> Compartir</button>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="about" role="tabpanel" aria-labelledby="about-tab">
          <h4>Información Personal</h4>
          <p>Nombre: {{ user.firstname }}</p>
          <p>Apellido: {{ user.lastname }}</p>
          <p>Email: {{ user.email }}</p>
          <p>Descripción: {{ user.bio }}</p>
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
              <input @change="handleFileUpload" type="file" class="form-control" id="inputAvatar">
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
import UserPublications from './UserPublications.vue'; // Importa el componente de publicaciones de usuario

export default {
  name: 'Profile',
  components: {
    UserPublications // Registra el componente de publicaciones de usuario
  },
  data() {
    return {
      user: {},
      publications: [] // Agrega la propiedad publications para almacenar las publicaciones del usuario
    };
  },
  async created() {
    const token = Cookies.get('token');

    if (token) {
      try {
        const responseUser = await axios.get('http://localhost:8080/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = responseUser.data; // Almacena los datos del usuario

        const responsePublications = await axios.get(`http://localhost:8080/api/publications/user/${this.user.id}`);
        this.publications = responsePublications.data;
      } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
      }
    } else {
      // No hay token de autenticación, redirecciona al usuario a la página de inicio de sesión
      this.$router.push('/login');
    }
  },
  methods: {
    confirmLogout() {
      if (confirm("¿Está seguro de que quiere cerrar su sesión?")) {
        this.logout();
      }
    },
    logout() {
      Cookies.remove('token');
      this.$router.push('/login');
    },
    updateProfile() {
      // Lógica para actualizar el perfil del usuario
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      // Lógica para manejar la carga del archivo
    }
  }
};
</script>

<style>
.profile-header {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #007bff;
  background: linear-gradient(to right, #0062E6, #33AEFF);
}

.profile-header .profile-image {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid white;
  border-radius: 50%;
}

.profile-header .profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.profile-header .profile-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
}

.profile-header .profile-info h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.profile-header .profile-info p {
  margin: 0;
  font-size: 16px;
}

.profile-content {
  margin-top: 60px;
}

.profile-content .nav-tabs .nav-link {
  font-weight: bold;
}

.profile-content .tab-content {
  margin-top: 20px;
}

.profile-post {
  border: 1px solid #e1e1e1;
  padding: 20px;
  margin-bottom: 20px;
}

.profile-post .post-header {
  display: flex;
  align-items: center;
}

.profile-post .post-header img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-post .post-user {
  font-weight: bold;
}

.profile-post .post-date {
  margin-left: auto;
  color: #888;
}

.profile-post .post-content {
  margin-top: 10px;
}

.profile-post .post-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.profile-post .post-actions .btn {
  display: flex;
  align-items: center;
}

.profile-post .post-actions .btn i {
  margin-right: 5px;
}
</style>
