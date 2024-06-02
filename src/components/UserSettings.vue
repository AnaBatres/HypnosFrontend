<template>
  <div>
    <!-- Navbar -->
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
              <RouterLink class="nav-link" aria-current="page" to="/"><i class="bi bi-house-fill text-white"></i></RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/explore"><i class="bi bi-compass text-white"></i></RouterLink>
            </li> 
            <li class="nav-item">
              <RouterLink class="nav-link" to="/notifications"><i class="bi bi-bell text-white"></i></RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/create-publication"><i class="bi bi-cloud-upload text-white"></i></RouterLink>
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
                <i class="bi bi-person-circle text-white"></i> {{ user.firstname }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <RouterLink class="dropdown-item" to="/profile">Perfil</RouterLink>
                <RouterLink class="dropdown-item" to="/settings">Configuración</RouterLink>
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
   <!-- User Settings -->
   <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h4>Configuración de la Cuenta</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="inputFirstname" class="form-label">Nombre</label>
                <input v-model="user.firstname" type="text" class="form-control" id="inputFirstname" :disabled="!editMode">
              </div>
              <div class="mb-3">
                <label for="inputLastname" class="form-label">Apellido</label>
                <input v-model="user.lastname" type="text" class="form-control" id="inputLastname" :disabled="!editMode">
              </div>
              <div class="mb-3">
                <label for="inputAlias" class="form-label">Alias</label>
                <input v-model="user.alias" type="text" class="form-control" id="inputAlias" :disabled="!editMode">
              </div>
              <div class="mb-3">
                <label for="inputEmail" class="form-label">Email</label>
                <input v-model="user.email" type="email" class="form-control" id="inputEmail" placeholder="name@example.com" :disabled="!editMode">
              </div>
              <div class="mb-3">
                <label for="inputPassword" class="form-label">Contraseña</label>
                <input v-model="password" type="password" class="form-control" id="inputPassword" :disabled="!editMode">
              </div>
              <div class="mb-3" v-if="editMode">
                <label for="inputAvatar" class="form-label">Foto de perfil</label>
                <input @change="handleFileUpload" type="file" class="form-control" id="inputAvatar">
              </div>
              <button v-if="editMode" type="submit" class="btn btn-primary">Guardar Cambios</button>
              <button v-else type="button" @click="editMode = true" class="btn btn-secondary">Editar Perfil</button>
            </form>
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
name: 'UserSettings',
data() {
  return {
    user: {
      firstname: '',
      lastname: '',
      alias: '',
      email: '',
      avatarUrl: ''
    },
    password: '',
    selectedFile: null,
    editMode: false
  };
},
async created() {
  try {
    const token = Cookies.get('token');
    if (token) {
      const response = await axios.get('http://localhost:8080/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.user = response.data;
    } else {
      console.error('No se encontró el token en la cookie.');
    }
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
  }
},
methods: {
  handleFileUpload(event) {
    this.selectedFile = event.target.files[0];
  },
  async updateProfile() {
    try {
      const token = Cookies.get('token');
      if (token) {
        // Confirmar la contraseña antes de actualizar el perfil
        const confirmed = await this.confirmPassword(this.password);
        if (!confirmed) {
          alert('Contraseña incorrecta. No se pudo actualizar el perfil.');
          return;
        }

        const formData = new FormData();
        formData.append('email', this.user.email);
        formData.append('firstname', this.user.firstname);
        formData.append('lastname', this.user.lastname);
        formData.append('alias', this.user.alias);
        formData.append('password', this.password);
        if (this.selectedFile) {
          formData.append('avatar', this.selectedFile);
        }
        await axios.patch(`http://localhost:8080/api/users/${this.user.alias}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Perfil actualizado con éxito');
        this.editMode = false;
      } else {
        console.error('No se encontró el token en la cookie.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
    }
  },
  confirmPassword(password) {
    // Implementa lógica para confirmar la contraseña con el servidor
    return new Promise((resolve, reject) => {
      // Realiza una solicitud al servidor para confirmar la contraseña
      resolve(true); // Supongamos que la contraseña es correcta
    });
  },
  confirmLogout() {
    // Lógica para cerrar sesión
  }
}
};
</script>

<style scoped>
/* Estilos para el navbar */
.navbar {
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Estilos para el formulario de configuración */
.card {
border: none;
border-radius: 10px;
}

.card-header {
border-bottom: 1px solid #e1e1e1;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
}

.card-body {
padding: 2rem;
}

.form-label {
font-weight: bold;
}

.form-control {
border-radius: 5px;
}

.btn-primary {
background-color: #007bff;
border-color: #007bff;
transition: background-color 0.3s, border-color 0.3s;
}

.btn-primary:hover {
background-color: #0056b3;
border-color: #004085;
}

.mt-5 {
margin-top: 3rem !important;
}
</style>