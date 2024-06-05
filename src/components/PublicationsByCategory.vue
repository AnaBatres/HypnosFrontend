<template>
  <div>
    <Navbar />
    <h1>Sueños de la categoría {{ categoryName }}</h1>
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div v-if="dreams.length === 0">No hay sueños en esta categoría.</div>
      <div v-else>
        <div v-for="dream in dreams" :key="dream.id">
          <h3>{{ dream.title }}</h3>
          <p>{{ dream.text }}</p>
          <hr>
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
      dreams: []
    };
  },
  created() {
    this.fetchDreams();
  },
  methods: {
    async fetchDreams() {
      try {
        this.loading = true;
        const response = await axios.get(`http://localhost:8080/api/publications/categories?categoryIds=${this.categoryId}`);
        this.dreams = response.data;
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
    }
  },
  watch: {
    categoryId: {
      immediate: true,
      handler(newValue) {
        this.fetchDreams();
        this.fetchCategoryName();
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
</style>