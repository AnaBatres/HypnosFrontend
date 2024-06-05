<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="publication in randomPublications" :key="publication.id" class="col-md-6 mb-4">
            <div class="card h-100" @click="viewPublication(publication.id)">
              <div class="card-body">
                <p class="card-text text-muted" v-if="publication.user">{{ publication.user.alias }}</p>
                <h5 class="card-title">{{ publication.title }}</h5>
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
import Navbar from './Navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      randomPublications: [],
      loading: false,
      search: '',
      user: {
        search: ''
      }
    };
  },
  created() {
    this.loading = true;

    axios.get('http://localhost:8080/api/publications/random')
      .then(async response => {
        const userId = await this.fetchCurrentUserId(); // Fetch current user ID

        this.randomPublications = response.data.map(item => {
          const publicationUserId = item[4];
          return {
            id: item[0],
            title: item[3],
            text: item[2],
            userId: publicationUserId
          };
        });


        this.randomPublications = this.randomPublications.filter(publication => publication.userId !== userId);

        // Call getUserById for each publication to get the user alias
        this.randomPublications.forEach(publication => {
          this.getUserById(publication.userId);
        });
        this.loading = false;
      })
      .catch(error => {
        console.error('Error fetching random publications:', error);
        this.loading = false;
      });
  },
  methods: {
    async fetchCurrentUserId() {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data.id;
      } catch (error) {
        console.error('Error fetching current user ID:', error);
        return null;
      }
    },
    async getUserById(userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`);
        // Actualiza el usuario de la publicación con los datos obtenidos
        const user = response.data;
        this.randomPublications.forEach(publication => {
          if (publication.userId === userId) {
            publication.user = user;
          }
        });
      } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        // Manejar el error de red aquí
      }
    },
    viewPublication(id) {
      this.$router.push({ name: 'PublicationDetail', params: { id } });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  cursor: pointer;
}

.card:hover {
  background-color: #f8f9fa;
}
</style>
