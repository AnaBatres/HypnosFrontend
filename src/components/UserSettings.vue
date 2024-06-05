<template>
  <div>
    <Navbar />
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
                  <input v-model="user.firstname" type="text" class="form-control" id="inputFirstname"
                    :disabled="!editMode">
                </div>
                <div class="mb-3">
                  <label for="inputLastname" class="form-label">Apellido</label>
                  <input v-model="user.lastname" type="text" class="form-control" id="inputLastname"
                    :disabled="!editMode">
                </div>
                <div class="mb-3">
                  <label for="inputAlias" class="form-label">Alias</label>
                  <input v-model="user.alias" type="text" class="form-control" id="inputAlias" :disabled="!editMode">
                </div>
                <div class="mb-3">
                  <label for="inputEmail" class="form-label">Email</label>
                  <input v-model="user.email" type="email" class="form-control" id="inputEmail"
                    placeholder="name@example.com" :disabled="!editMode">
                </div>
                <div class="mb-3">
                  <label for="inputPassword" class="form-label">Contraseña</label>
                  <input v-model="password" type="password" class="form-control" id="inputPassword"
                    :disabled="!editMode">
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
import Navbar from './Navbar.vue';
import Swal from 'sweetalert2';

export default {
  name: 'UserSettings',
  components: {
    Navbar
  },
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
      if (!token) {
        console.error('No se encontró el token en la cookie.');
        return;
      }
      
      const response = await axios.get('http://localhost:8080/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      this.user = response.data;
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  },
  methods: {
    async updateProfile() {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('No se encontró el token en la cookie.');
          return;
        }

        const { value: password, dismiss: cancel } = await Swal.fire({
          title: 'Confirma tu contraseña',
          input: 'password',
          inputLabel: 'Contraseña',
          inputPlaceholder: 'Ingresa tu contraseña',
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        });

        if (cancel) {
          Swal.fire('Cancelado', 'No se ingresó ninguna contraseña', 'error');
          return;
        }

        const formData = new FormData();
        formData.append('email', this.user.email);
        formData.append('firstname', this.user.firstname);
        formData.append('lastname', this.user.lastname);
        formData.append('alias', this.user.alias);
        formData.append('password', password);

        if (this.selectedFile) {
          formData.append('avatar', this.selectedFile);
        }

        const response = await axios.patch(`http://localhost:8080/api/users/${this.user.alias}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          Swal.fire('Éxito', 'Perfil actualizado con éxito', 'success');
          this.editMode = false;
        } else {
          console.error('Error al actualizar el perfil del usuario:', response.data);
          Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
        }
      } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

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
