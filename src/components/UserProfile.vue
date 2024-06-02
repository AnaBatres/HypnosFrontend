<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <router-link to="/" class="navbar-brand text-light">HYPNOS</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link text-light" aria-current="page">
                                <i class="bi bi-house-door-fill" style="color: white;"></i>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/explore" class="nav-link text-light">
                                <i class="bi bi-compass-fill" style="color: white;"></i>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/notifications" class="nav-link text-light">
                                <i class="bi bi-bell-fill" style="color: white;"></i>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/create-publication" class="nav-link text-light">
                                <i class="bi bi-pencil-square" style="color: white;"></i>
                            </router-link>
                        </li>
                    </ul>

                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
                            v-model="user.search">
                        <button class="btn btn-outline-light" type="button" v-on:click="redirectToUserProfile">
                            <i class="bi bi-search"></i>
                        </button>
                    </form>

                    <ul class="navbar-nav ms-3">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle"></i> {{ user?.firstname || '' }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <router-link to="/profile" class="router-link-custom">
                                    <li><a class="dropdown-item"><i class="bi bi-person-circle"></i> Perfil</a></li>
                                </router-link>
                                <router-link to="/settings" class="router-link-custom">
                                    <li><a class="dropdown-item"><i class="bi bi-gear"></i> Configuración</a></li>
                                </router-link>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" @click="confirmLogout"><i
                                            class="bi bi-box-arrow-right"></i>
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
                    <!-- Código para mostrar la información del perfil -->
                </div>
                <div class="col-md-8">
                    <div class="profile-container">
                        <div class="profile-header">
                            <div class="profile-header-left">
                                <img :src="user.avatar" class="profile-avatar" alt="Profile Picture">
                            </div>
                            <div class="profile-header-right">
                                <h1 class="profile-name">{{ user.firstname }} {{ user.lastname }}</h1>
                                <p class="profile-alias">{{ user.alias }}</p>
                                <button class="btn btn-primary btn-sm">
                                    <i class="bi bi-person-plus-fill"></i> 
                                </button>
                                <button class="btn btn-danger btn-sm">
                                    <i class="bi bi-person-x-fill"></i> Bloquear
                                </button>
                            </div>
                        </div>
                        <div class="profile-publications">
                            <h2 class="section-title">Publicaciones</h2>
                            <div v-if="publications.length === 0" class="text-center mt-4">
                                <p>No hay publicaciones.</p>
                            </div>
                            <div v-else>
                                <div v-for="post in publications" :key="post.id" class="card mb-3">
                                    <router-link :to="'/publication/' + post.id" class="text-decoration-none">
                                        <div class="card-header">
                                            <h5 class="card-title text-center">
                                                {{ post.title }}
                                            </h5>
                                            <p class="card-text text-center"><small class="text-muted">Publicación</small></p>
                                        </div>
                                    </router-link>
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
    name: 'UserProfile',
    data() {
        return {
            user: {},
            publications: []
        };
    },
    async created() {
        try {
            const alias = this.$route.params.alias;
            const token = Cookies.get('token');
            if (token) {
                const userResponse = await axios.get(`http://localhost:8080/api/users/${alias}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.user = userResponse.data;

                const publicationsResponse = await axios.get(`http://localhost:8080/api/publications/user/${alias}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.publications = publicationsResponse.data;
            } else {
                console.error('No se encontró el token en la cookie.');
            }
        } catch (error) {
            console.error('Error al cargar el perfil del usuario:', error);
        }
    },
    methods: {
        formatDate(date) {
            // Lógica para formatear la fecha según tus preferencias
        }
    }
};
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-header-left {
    flex: 1;
}

.profile-header-right {
    flex: 3;
    padding-left: 20px;
}

.profile-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile-name {
    font-size: 24px;
    margin-bottom: 5px;
}

.profile-email,
.profile-alias {
    margin-bottom: 10px;
}

.btn-primary {
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.section-title {
    font-size: 20px;
    margin-bottom: 20px;
}

.no-publications {
    text-align: center;
}

.publication {
    margin-bottom: 20px;
}

.publication-title {
    font-size: 20px;
    margin-bottom: 5px;
}

.publication-text {
    margin-bottom: 10px;
}

.publication-date {
    font-style: italic;
}
</style>