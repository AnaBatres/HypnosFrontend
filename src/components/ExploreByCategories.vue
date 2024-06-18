<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div class="p-3 mb-4">
        <h2 class="text-center text-white mb-0">Explora los sueños de HYPNOS por categorias</h2>
      </div>
      <div class="category-buttons mb-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="toggleCategory(category.id)"
          :class="selectedCategories.includes(category.id) ? 'btn btn-primary' : 'btn btn-secondary'"
        >
          {{ category.name }}
        </button>
      </div>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="publication in paginatedPublicationsWithAlias" :key="publication.id" class="col-md-6 mb-4">
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
    Navbar,
  },
  data() {
    return {
      categories: [],
      followedUsers: [],
      publications: [],
      paginatedPublications: [],
      selectedCategories: [],
      loading: false,
      currentPage: 1,
      pageSize: 6,
    };
  },
  async created() {
    this.loading = true;
    await this.fetchCategories();
    await this.selectDefaultCategories();
    this.loading = false;
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axiosInstance.get('/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async selectDefaultCategories() {
      const defaultCategories = ['erótico', 'profético', 'aventura'];
      const categoryIds = this.categories
        .filter(category => defaultCategories.includes(category.name.toLowerCase()))
        .map(category => category.id);

      this.selectedCategories = categoryIds;

      await this.fetchPublicationsByCategories();
    },
    async fetchPublicationsByCategories() {
      try {
        const response = await axiosInstance.get('/publications/categories', {
          params: {
            categoryIds: this.selectedCategories.join(','),
          },
        });

        const userId = await this.fetchCurrentUserId();

        this.publications = response.data.map(item => {
          return {
            id: item.id,
            title: item.title,
            text: item.text,
            userId: item.userId,
            likesCount: 0,
            user: item.user,
          };
        });

        this.paginatePublications();
      } catch (error) {
        console.error('Error fetching publications by category:', error);
      }
    },
    async fetchCurrentUserId() {
      try {
        const response = await axiosInstance.get('/profile/me');
        return response.data.id;
      } catch (error) {
        console.error('Error al obtener el ID de usuario actual:', error);
        return null;
      }
    },
    toggleCategory(categoryId) {
      if (this.selectedCategories.includes(categoryId)) {
        this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
      } else {
        this.selectedCategories.push(categoryId);
      }

      this.fetchPublicationsByCategories();
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
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.publications.length / this.pageSize);
    },
    paginatedPublicationsWithAlias() {
      return this.paginatedPublications.filter(publication => publication.user && publication.user.alias);
    },
  },
};
</script>

<style scoped>
.p-3{
  background-color: #ac00a4;
}

.container {
  max-width: 1230px;
  margin: 0 auto;
}

.bg-dark {
  background-color: #343a40 !important;
}

.card {
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  background-color: #f8f9fa;
  transform: translateY(-5px);
}

.alias-header {
  background-color: #ff00f2;
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
}

.page-link {
  background-color: #343a40;
  border-color: #343a40;
  color: #fff;
}

.page-link:hover {
  background-color: #23272b;
  border-color: #23272b;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  pointer-events: none;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.category-buttons {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: center;
  margin-bottom: 20px;
}

.category-buttons button {
  flex: 0 0 auto;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
}

.category-buttons .btn-primary {
  background-color: #ff00f2;
  border-color: #ff00f2;
}

.category-buttons .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
