<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div class="p-3 mb-4">
        <h2 class="text-center text-white mb-0">Publicaciones que te gustan en HYPNOS</h2>
      </div>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="(publication, index) in paginatedPublications" :key="publication.id" class="col-md-6 mb-4">
            <div class="card h-100" @click="viewPublication(publication.id)">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="alias-header bg-blue text-white">{{ publication.user.alias }}</span>
                  <div class="d-flex align-items-center">
                    <span class="text-muted me-2">{{ publication.likesCount }}</span>
                    <i class="bi bi-heart-fill text-danger"></i>
                  </div>
                </div>
                <h5 class="card-title text-dark mt-2">{{ publication.title }}</h5>
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
import Navbar from './Navbar.vue';
import axiosInstance from '../axiosConfig';

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
  async created() {
    this.loading = true;

    try {
      const userId = await this.fetchCurrentUserId();
      const response = await axiosInstance.get(`publications/liked/${userId}`);
      
      // Filtrar publicaciones del usuario logueado y eliminar duplicados
      const uniquePublications = [];
      const publicationSet = new Set();
      response.data.forEach(item => {
        if (item.user.id !== userId && !publicationSet.has(item.id)) {
          publicationSet.add(item.id);
          uniquePublications.push({
            id: item.id,
            title: item.title,
            text: item.text,
            user: { alias: item.user.alias },
            likesCount: 0 
          });
        }
      });

      this.publications = uniquePublications;

      await Promise.all(this.publications.map(async publication => {
        publication.likesCount = await this.getLikesCount(publication.id);
      }));

      this.paginatePublications();
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener publicaciones que te gustan:', error);
      this.loading = false;
    }
  },
  methods: {
    async fetchCurrentUserId() {
      try {
        const response = await axiosInstance.get('/profile/me');
        return response.data.id;
      } catch (error) {
        console.error('Error al obtener el ID de usuario actual:', error);
        return null;
      }
    },
    async getLikesCount(publicationId) {
      try {
        const response = await axiosInstance.get(`/publications/${publicationId}/likes`);
        const likes = response.data; 
        return likes; 
      } catch (error) {
        console.error('Error al obtener la cantidad de likes:', error);
        return 0; 
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
.p-3 {
  background-color: #a12424;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.bg-blue {
  background-color: #a81d1d;
}

.card {
  cursor: pointer;
}

.card:hover {
  background-color: #f8f9fa;
}

.alias-header {
  padding: 3px 6px;
  border-radius: 4px;
}

.bi-heart-fill {
  font-size: 1.2rem;
}
</style>
