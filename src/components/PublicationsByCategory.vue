<template>
  <div>
    <Navbar @categorySelected="handleCategorySelected" />
    <div class="container-fluid d-flex justify-content-center align-items-center vh-100 px-5">
      <div class="text-center">
        <h2 class="mb-5">Descubre los sueños de la categoría "{{ categoryName }}"</h2>
        <div v-if="loading" class="text-center">Cargando...</div>
        <div v-else>
          <div v-if="dreams.length === 0" class="text-center mb-4">No hay sueños en esta categoría.</div>
          <div class="row justify-content-center">
            <div v-for="dream in paginatedDreams" :key="dream.id" class="col-lg-6 mb-4">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h6 class="card-subtitle mb-2 text-muted">{{ dream.user.alias }}</h6> 
                  <router-link :to="'/publication/' + dream.id" class="text-decoration-none"> 
                    <h5 class="card-title">{{ dream.title }}</h5> 
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center mt-4">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">&laquo;</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': page === currentPage }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">&raquo;</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
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
      handler(newValue) {
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
      const endIndex = startIndex + this.pageSize;
      return this.dreams.slice(startIndex, endIndex);
    }
  },
  methods: {
    async fetchDreams() {
      try {
        this.loading = true;
        const response = await axios.get(`http://localhost:8080/api/publications/category/${this.categoryId}`);
        this.dreams = response.data;
        console.log(this.dreams);
        this.loading = false;
      } catch (error) {
        console.error('Error fetching dreams:', error);
        this.loading = false;
      }
    },
    async fetchCategoryName() {
      try {
        const response = await axios.get(`http://localhost:8080/api/categories/${this.categoryId}`);
        this.categoryName = response.data.name;
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
    }
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.vh-100 {
  min-height: 100vh;
}
</style>
