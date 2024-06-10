<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div class="bg-dark p-3 mb-4">
        <h2 class="text-center text-white mb-0">Explora los sueños de los usuarios de HYPNOS</h2>
      </div>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="(publication, index) in paginatedPublicationsWithAlias" :key="publication.id" class="col-md-6 mb-4">
            <div class="card h-100" @click="viewPublication(publication.id)">
              <div class="card-body">
                <p class="card-text" v-if="publication.user">
                  <span class="alias-header bg-blue text-white">{{ publication.user.alias }}</span>
                </p>
                <h5 class="card-title text-dark">{{ publication.title }}</h5>
              </div>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mt-4">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <a class="page-link bg-dark text-white" href="#" @click.prevent="previousPage">&laquo;</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': page === currentPage }">
              <a class="page-link bg-dark text-white" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
              <a class="page-link bg-dark text-white" href="#" @click.prevent="nextPage">&raquo;</a>
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
      pageSize: 6
    };
  },
  created() {
    this.loading = true;

    axios.get('http://localhost:8080/api/publications/random')
      .then(async response => {
        console.log('Response from /api/publications/random:', response.data);

        const userId = await this.fetchCurrentUserId();
        console.log('Current user ID:', userId);

        this.publications = response.data.map(item => {
          console.log('Mapping item:', item);
          const publicationUserId = item.userId || item[4]; 
          return {
            id: item.id || item[0], 
            title: item.title || item[3],
            text: item.text || item[2], 
            userId: publicationUserId
          };
        });

        console.log('Mapped publications:', this.publications);

        this.publications = this.publications.filter(publication => publication.userId !== userId);
        console.log('Filtered publications (excluding current user):', this.publications);

        await Promise.all(this.publications.map(async publication => {
          const alias = await this.getUserAliasByPostId(publication.id);
          if (alias) {
            publication.user = { alias };
          }
        }));

        console.log('Publications with user alias:', this.publications);

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
        console.log('Response from /api/profile/me:', response.data);
        return response.data.id;
      } catch (error) {
        console.error('Error al obtener el ID de usuario actual:', error);
        return null;
      }
    },
    async getUserAliasByPostId(postId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/publications/id/${postId}`);
        console.log(`Response from /api/publications/id/${postId}:`, response.data);
        const publication = response.data;
        return publication.user ? publication.user.alias : null;
      } catch (error) {
        console.error('Error al obtener el alias del usuario por ID de publicación:', error);
        return null;
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
    },
    paginatedPublicationsWithAlias() {
      return this.paginatedPublications.filter(publication => publication.user && publication.user.alias);
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

.alias-header {
  background-color: #007bff;
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px;
}
</style>
