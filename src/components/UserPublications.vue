<template>
  <div>
    <div v-for="post in publications" :key="post.id" class="profile-post">
      <div class="post-header">
        <img :src="post.user.avatarUrl" alt="User Picture">
        <div class="post-user">{{ post.user.alias }}</div>
        <div class="post-date">{{ post.date }}</div>
      </div>
      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>
      <div class="post-actions">
        <button class="btn btn-outline-primary btn-sm"><i class="fas fa-thumbs-up"></i> Me gusta</button>
        <button class="btn btn-outline-secondary btn-sm"><i class="fas fa-comment"></i> Comentar</button>
        <button class="btn btn-outline-danger btn-sm"><i class="fas fa-share"></i> Compartir</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Publications',
  props: ['userId'],
  data() {
    return {
      publications: []
    };
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:8080/api/publications/user/${this.userId}`);
      this.publications = response.data;
    } catch (error) {
      console.error('Error al obtener las publicaciones del usuario:', error);
    }
  }
};
</script>

<style>
/* Estilos de las publicaciones */
</style>
