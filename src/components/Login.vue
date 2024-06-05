<template>
  <div>
    <!-- Formulario -->
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h1 class="card-title text-center mb-5 fw-bold fs-3">HYPNOS</h1>
              <form @submit.prevent="login">
                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
                    v-model="email" required>
                  <label for="floatingInput">Email</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                    v-model="password" required>
                  <label for="floatingPassword">Contraseña</label>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="rememberPasswordCheck" v-model="rememberPassword">
                  <label class="form-check-label" for="rememberPasswordCheck">Recordar contraseña</label>
                </div>
                <div class="d-grid">
                  <button class="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Entrar</button>
                </div>
                <hr class="my-4">
                <div class="d-grid mb-2">
                  <a class="btn btn-google btn-login text-uppercase fw-bold" href="https://accounts.google.com/signin">
                    <i class="fab fa-google me-2"></i> Iniciar sesión con Google
                  </a>
                </div>
                <div class="d-grid">
                  <a class="btn btn-facebook btn-login text-uppercase fw-bold" href="https://www.facebook.com/login/">
                    <i class="fab fa-facebook-f me-2"></i> Iniciar sesión con Facebook
                  </a>
                </div>
                <div class="text-center mt-3">
                  <p class="mb-0">¿No tienes cuenta? <router-link to="/" class="fw-bold">Regístrate</router-link></p>
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
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberPassword: false
    };
  },
  created() {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.rememberPassword = true;
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const token = response.data;

        Cookies.set('token', token, { expires: this.rememberPassword ? 7 : null }); // Expira en 7 días si se selecciona "Recordar contraseña"

        // Guardar datos en localStorage si se ha marcado "Recordar contraseña"
        if (this.rememberPassword) {
          localStorage.setItem('email', this.email);
          localStorage.setItem('password', this.password);
        } else {
          // Si no se recuerda la contraseña, eliminar los datos de localStorage
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }

        this.$router.push('/profile');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          this.showCredentialsErrorAlert();
        } else {
          this.showGenericErrorAlert();
        }
      }
    },
    showCredentialsErrorAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Error de credenciales',
        text: 'Correo electrónico o contraseña incorrectos.',
        confirmButtonText: 'Aceptar'
      });
    },
    showGenericErrorAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
        confirmButtonText: 'Aceptar'
      });
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
