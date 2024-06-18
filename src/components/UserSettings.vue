<template>
  <div>
    <Navbar />
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
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
                <button v-if="editMode" type="button" @click="promptEmail" class="btn btn-dark">Guardar Cambios</button>
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
import Navbar from './Navbar.vue';
import Swal from 'sweetalert2';
import axiosInstance from '../axiosConfig';

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
      editMode: false
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/profile/me');
      this.user = response.data;
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  },
  methods: {
    async promptEmail() {
      const { value: email } = await Swal.fire({
        title: 'Confirma tu correo electrónico',
        input: 'email',
        inputLabel: 'Correo electrónico',
        inputPlaceholder: 'Introduce tu correo electrónico',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (email) {
        if (email === this.user.email) {
          this.updateProfile();
        } else {
          Swal.fire('Error', 'El correo electrónico no coincide', 'error');
        }
      } else {
        Swal.fire('Error', 'Correo electrónico no proporcionado', 'error');
      }
    },
    async updateProfile() {
      try {
        const userUpdateData = {
          email: this.user.email,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          alias: this.user.alias
        };
        const response = await axiosInstance.patch(`/users/${this.user.alias}`, userUpdateData );
        if (response.status === 200) {
          Swal.fire('Éxito', 'Perfil actualizado con éxito', 'success');
          this.editMode = false;
        } else {
          throw new Error('No se pudo actualizar el perfil.');
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
  background-color: #343a40;
  border-color: #343a40;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-primary:hover {
  background-color: #23272b;
  border-color: #1d2124;
}

.btn-dark {
  background-color: #343a40;
  border-color: #343a40;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-dark:hover {
  background-color: #23272b;
  border-color: #1d2124;
}

.mt-5 {
  margin-top: 3rem !important;
}
</style>
