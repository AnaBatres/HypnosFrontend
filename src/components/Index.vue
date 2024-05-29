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
                            <a class="nav-link" aria-current="page" href="#"><i
                                    class="bi bi-house-fill text-white"></i></a>
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
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle text-white"></i> {{ user.firstname }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <RouterLink to="/profile">
                                    <li><a class="dropdown-item">Perfil</a></li>
                                </RouterLink>
                                <RouterLink to="/settings">
                                    <li><a class="dropdown-item">Configuración</a></li>
                                </RouterLink>
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
                <img :src="avatarPreviewUrl || user.avatarUrl || 'https://via.placeholder.com/150'"
                    alt="Profile Picture">
            </div>
            <div class="profile-info">
                <h2>{{ user.firstname }}</h2>
                <p>{{ '@' + user.username }}</p>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <!-- Iteración sobre las publicaciones -->
                    <div v-for="post in randomPublications" :key="post.id" class="card mb-3">
                        <div class="card-header">
                            <!-- Mostrar el nombre del usuario -->
                            {{ post.user.firstname }}
                        </div>
                        <div class="card-body">
                            <!-- Mostrar el contenido de la publicación -->
                            <p class="card-text">{{ post.text }}</p>
                        </div>
                        <div class="card-footer">
                            <!-- Mostrar los likes y comentarios -->
                            <div>
                                <i class="bi bi-heart"></i> {{ post.likedByUsers.length }} Likes
                            </div>
                            <div>
                                <i class="bi bi-chat"></i> {{ post.comments.length }} Comentarios
                            </div>
                            <!-- Botones para interactuar con la publicación -->
                            <div class="btn-group">
                                <button class="btn btn-outline-primary" @click="likePost(post.id)">
                                    <i class="bi bi-heart"></i> Me gusta
                                </button>
                                <button class="btn btn-outline-secondary" @click="commentPost(post.id)">
                                    <i class="bi bi-chat"></i> Comentar
                                </button>
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

export default {
    name: 'SocialNetwork',
    data() {
        return {
            randomPublications: []
        };
    },
    created() {
        this.fetchRandomPublications();
    },
    methods: {
        async fetchRandomPublications() {
            try {
                // Hacer la solicitud al backend para obtener publicaciones aleatorias
                const response = await axios.get('http://localhost:8080/api/publications/random?page=1&size=10');
                this.randomPublications = response.data;
            } catch (error) {
                console.error('Error al obtener las publicaciones:', error);
            }
        },
        async likePost(postId) {
            try {
                // Hacer la solicitud al backend para dar like a una publicación
                await axios.post(`http://localhost:8080/api/publications/${postId}/like`);
                // Actualizar la lista de publicaciones después de dar like
                this.fetchRandomPublications();
            } catch (error) {
                console.error('Error al dar like a la publicación:', error);
            }
        },
        async commentPost(postId) {
            try {
                // Hacer la solicitud al backend para comentar en una publicación
                // Puedes implementar esta función según los métodos de tu backend
                // Por ejemplo, podrías abrir un modal o una nueva página para ingresar el comentario
            } catch (error) {
                console.error('Error al comentar la publicación:', error);
            }
        }
    }
};
</script>