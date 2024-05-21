<template>
  <div>

    <!-- Formulario -->
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h1 class="card-title text-center mb-5 fw-bold fs-3">HYPNOS</h1>
              <form>
                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                  <label for="floatingInput">Email</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
                  <label for="floatingPassword">Contraseña</label>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" value="" id="rememberPasswordCheck">
                  <label class="form-check-label" for="rememberPasswordCheck">
                    Recordar contraseña
                  </label>
                </div>
                <div class="d-grid">
                  <button class="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Entrar</button>
                </div>
                <hr class="my-4">
                <div class="d-grid mb-2">
                  <button class="btn btn-google btn-login text-uppercase fw-bold" type="submit">
                    <i class="fab fa-google me-2"></i> Iniciar sesión con Google
                  </button>
                </div>
                <div class="d-grid">
                  <button class="btn btn-facebook btn-login text-uppercase fw-bold" type="submit">
                    <i class="fab fa-facebook-f me-2"></i> Iniciar sesión con Facebook
                  </button>
                </div>
                <div class="text-center mt-3">
                  <p class="mb-0">¿No tienes cuenta? <RouterLink to="/" class="fw-bold">Regístrate</RouterLink></p>
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
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email: this.email,
          password: this.password
        });
        const token = response.data;
        localStorage.setItem('token', token);
        this.$router.push('/profile');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Mostrar un mensaje de error al usuario (opcional)
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
