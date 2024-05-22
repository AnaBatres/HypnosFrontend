<template>
  <div>
    <!-- Formulario -->
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h3 class="card-title text-center mb-5 fw-light fs-5">Regístrate en <h2>HYPNOS</h2> para compartir tus
                sueños con amigos.</h3>
              <form @submit.prevent="register">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingFirstName" placeholder="Nombre"
                    v-model="firstname" required>
                  <label for="floatingFirstName">Nombre</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingLastName" placeholder="Apellido"
                    v-model="lastname" required>
                  <label for="floatingLastName">Apellido</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingAlias" placeholder="Alias" v-model="alias"
                    required>
                  <label for="floatingAlias">Nombre de usuario</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com"
                    v-model="email" required>
                  <label for="floatingEmail">Email</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="floatingPassword" placeholder="Contraseña"
                    v-model="password" required>
                  <label for="floatingPassword">Contraseña</label>
                </div>
                <div class="d-grid">
                  <button class="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Registrarse</button>
                </div>
                <hr class="my-4">
                <div class="d-grid mb-2">
                  <button class="btn btn-google btn-login text-uppercase fw-bold" type="button">
                    <i class="fab fa-google me-2"></i> Iniciar sesión con Google
                  </button>
                </div>
                <div class="d-grid">
                  <button class="btn btn-facebook btn-login text-uppercase fw-bold" type="button">
                    <i class="fab fa-facebook-f me-2"></i> Iniciar sesión con Facebook
                  </button>
                </div>
                <div class="text-center mt-3">
                  <p class="mb-0">¿Ya tienes cuenta? <RouterLink to="/login" class="fw-bold">Iniciar Sesión</RouterLink>
                  </p>
                </div>
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

export default {
  data() {
    return {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      alias: ''
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:8080/api/auth/signup', {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          alias: this.alias,
          password: this.password
        });
        console.log('Registro exitoso.'); // Imprime un mensaje de éxito en la consola
        this.$router.push('/'); // Redirige a la página de inicio u otra página después del registro
      } catch (error) {
        if (error.response) {
          console.error('Error al registrar usuario:', error.response.data);
          alert(`Error al registrar usuario: ${error.response.data.message || error.response.data}`);
        } else {
          console.error('Error al registrar usuario:', error.message);
          alert('Error al registrar usuario: Ha ocurrido un error inesperado.');
        }
      }
    }
  }
};
</script>

<style>
body {
  background: #007bff;
  background: linear-gradient(to right, #a6b0be, #33AEFF);
}

.btn-login {
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  padding: 0.75rem 1rem;
}

.btn-google {
  color: white !important;
  background-color: #ea4335;
}

.btn-facebook {
  color: white !important;
  background-color: #3b5998;
}
</style>
