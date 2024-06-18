<template>
  <div>
    <Navbar @categorySelected="handleCategorySelected" />
    <div class="container-fluid d-flex justify-content-center align-items-center vh-100 px-5">
      <div class="text-center">
        <div class="bg-dark p-3 mb-4">
          <h2 class="text-center text-white mb-0">Descubre los sueños de la categoría "{{ categoryName }}"</h2>
        </div>
        <div v-if="loading" class="text-center">Cargando...</div>
        <div v-else>
          <div v-if="dreams.length === 0" class="text-center mb-4">No hay sueños en esta categoría.</div>
          <div class="row justify-content-center">
            <div v-for="dream in paginatedDreams" :key="dream.id" class="col-lg-6 mb-4">
              <div class="card shadow-sm">
                <div class="card-header" style="background-color: #6F9BA9; color: white;">
                  <h6 class="mb-0">{{ dream.user.alias }}</h6>
                </div>
                <div class="card-body">
                  <router-link :to="'/publication/' + dream.id" class="text-decoration-none">
                    <h5 class="card-title text-dark">{{ dream.title }}</h5>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mt-4">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <a class="page-link bg-dark text-white" href="#" @click.prevent="prevPage">&laquo;</a>
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
  </div>
</template>

<script>
import axiosInstance from '../axiosConfig';
import Navbar from './Navbar.vue';

export default {
  components: {
    Navbar
  },
  props: {
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      categoryName: '',
      dreams: [],
      currentPage: 1,
      pageSize: 6
    };
  },
  created() {
    this.fetchDreams();
    this.fetchCategoryName();
  },
  watch: {
    categoryId: {
      immediate: true,
      handler() {
        this.fetchDreams();
        this.fetchCategoryName();
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.dreams.length / this.pageSize);
    },
    paginatedDreams() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.dreams.slice(startIndex, startIndex + this.pageSize);
    }
  },
  methods: {
    async fetchDreams() {
      this.loading = true;
      try {
        const token = Cookies.get('token');
        if (token) {
          const categoriesResponse = await axiosInstance.get(`/categories`);
          const categories = categoriesResponse.data;
          const dreams = [];
          for (const category of categories) {
            const publicationsResponse = await axiosInstance.get(`/publications/categories`, {
              params: { categoryIds: [category.id] }
            });
            const publications = publicationsResponse.data;
            dreams.push(...publications);
          }
          this.dreams = dreams;
        }
      } catch (error) {
        console.error('Error fetching dreams:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategoryName() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axiosInstance.get(`/categories/${this.categoryId}`);
          this.categoryName = response.data.name;
          console.log(this.categoryName);
        }
      } catch (error) {
        console.error('Error fetching category name:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handleCategorySelected(categoryId) {
      this.$emit('update:categoryId', categoryId);
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.vh-100 {
  min-height: 100vh;
}

.card-header {
  border-bottom: 1px solid #e1e1e1;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-title {
  color: #000;
}

.page-link {
  background-color: #343a40 !important;
  color: #fff !important;
  border: 1px solid #343a40;
}

.page-link:hover {
  background-color: #23272b !important;
  border-color: #23272b;
}

.page-item.active .page-link {
  background-color: #007bff !important;
  border-color: #007bff !important;
}
</style>
