<template>
    <div class="container mt-5">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">{{ publication.title }}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">{{ publication.content }}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Publicado por: {{ publication.user.username }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      publicationId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        publication: {}
      };
    },
    async mounted() {
      try {
        const response = await axios.get(`http://localhost:8080/api/publications/${this.publicationId}`);
        this.publication = response.data;
      } catch (error) {
        console.error('Error fetching publication:', error);
        alert('Hubo un error al cargar la publicación.');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para este componente */
  </style>
  