<template>

  
  <div class="container">
    <h2 class="text-center mb-4">Publicaciones Aleatorias</h2>
    <div v-if="loading" class="text-center">Cargando...</div>
    <div v-else>
      <div class="row">
        <div v-for="publication in randomPublications" :key="publication.id" class="col-md-4 mb-4">
          <div class="card h-100" @click="viewPublication(publication.id)">
            <div class="card-body">
              <h5 class="card-title">{{ publication.title }}</h5>
              <p class="card-text">{{ publication.text.substring(0, 100) }}{{ publication.text.length > 100 ? '...' : '' }}</p>
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
  data() {
    return {
      randomPublications: [],
      loading: false
    };
  },
  created() {
    this.loading = true;
    axios.get('http://localhost:8080/api/publications/random')
      .then(response => {
        this.randomPublications = response.data.map(item => ({
          id: item[0],
          title: item[1],
          text: item[2]
        }));
        this.loading = false;
      })
      .catch(error => {
        console.error('Error al obtener las publicaciones aleatorias:', error);
        this.loading = false;
      });
  },
  methods: {
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
