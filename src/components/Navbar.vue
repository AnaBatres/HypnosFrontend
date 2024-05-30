<template>
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
                <i class="bi bi-person-circle"></i> {{ user.firstname || '' }}
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
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'Navbar',
    computed: {
      ...mapState({
        user: state => state.profile // Asegúrate de cambiar "user" por el nombre correcto del módulo en Vuex
      })
    },
    methods: {
      confirmLogout() {
        // Aquí puedes implementar la lógica para cerrar sesión
      }
    }
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos específicos para el navbar si lo necesitas */
  </style>
  