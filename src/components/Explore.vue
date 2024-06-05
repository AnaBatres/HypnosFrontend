<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <h2 class="text-center mb-4">Explora los sueños de los usuarios de HYPNOS</h2>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="(publication, index) in paginatedPublications" :key="publication.id" class="col-md-6 mb-4">
            <div class="card h-100" @click="viewPublication(publication.id)">
              <div class="card-body">
                <p class="card-text text-muted" v-if="publication.user">{{ publication.user.alias }}</p>
                <h5 class="card-title">{{ publication.title }}</h5>
              </div>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mt-4">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="previousPage">Anterior</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ 'active': page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage">Siguiente</a>
            </li>
          </ul>
        </nav>
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
      publications: [],
      paginatedPublications: [],
      loading: false,
      currentPage: 1,
      pageSize: 6 // Cambiar el tamaño de la página aquí
    };
  },
  created() {
    this.loading = true;

    axios.get('http://localhost:8080/api/publications/random')
      .then(async response => {
        const userId = await this.fetchCurrentUserId(); // Obtener ID del usuario actual

        this.publications = response.data.map(item => {
          const publicationUserId = item[4];
          return {
            id: item[0],
            title: item[3],
            text: item[2],
            userId: publicationUserId
          };
        });

        this.publications = this.publications.filter(publication => publication.userId !== userId);

        // Llamar a getUserById para cada publicación para obtener el alias del usuario
        this.publications.forEach(publication => {
          this.getUserById(publication.userId);
        });

        // Configuración inicial de paginación
        this.paginatePublications();

        this.loading = false;
      })
      .catch(error => {
        console.error('Error al obtener publicaciones aleatorias:', error);
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
        console.error('Error al obtener el ID de usuario actual:', error);
        return null;
      }
    },
    async getUserById(userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`);
        // Actualizar el usuario de la publicación con los datos obtenidos
        const user = response.data;
        this.publications.forEach(publication => {
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
    },
    paginatePublications() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.paginatedPublications = this.publications.slice(startIndex, startIndex + this.pageSize);
    },
    changePage(page) {
      this.currentPage = page;
      this.paginatePublications();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginatePublications();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginatePublications();
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.publications.length / this.pageSize);
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
