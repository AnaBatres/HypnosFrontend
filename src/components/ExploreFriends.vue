<template>
    <div>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="(publication, index) in followedPublications" :key="index" class="col-md-6 mb-4">
            <!-- Renderizar las publicaciones aquí -->
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{{ publication.title }}</h5>
                <p class="card-text">{{ publication.user.alias }}</p>
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
    data() {
        return {
            followedPublications: [],
            loading: false,
        };
    },
    async created() {
        try {
            this.loading = true;
            await this.getCurrentUserAlias();
            this.loading = false;
        } catch (error) {
            console.error('Error fetching followed publications:', error);
            this.loading = false;
        }
    },
    methods: {
        async getCurrentUserAlias() {
            const token = Cookies.get('token');
            if (token) {
                const response = await axios.get('http://localhost:8080/api/profile/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const userData = response.data;

                this.user = {
                    id: userData.id,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email,
                    alias: userData.alias,
                    password: ''
                };


                const followingResponse = await axios.get(`http://localhost:8080/api/users/${userData.alias}/following`);
                const following = followingResponse.data;
                
                // Obtener las publicaciones de los usuarios seguidos
                const publicationPromises = following.map(async user => {
                    const publicationsResponse = await axios.get(`http://localhost:8080/api/publications/user/${user.alias}`);
                    return publicationsResponse.data;
                });
                const publications = await Promise.all(publicationPromises);
                this.followedPublications = publications.flat(); // Aplanar la matriz de publicaciones
            }
        },
    },
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
