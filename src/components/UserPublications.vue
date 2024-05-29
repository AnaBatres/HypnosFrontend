<template>
  <div>
    <div v-for="post in publications" :key="post.id" class="profile-post">
      <div class="post-header">
        <img :src="user.avatarUrl" alt="User Picture">
        <div class="post-user">{{ user.alias }}</div>
        <div class="post-date">{{ post.createAd }}</div>
      </div>
      <div class="post-content">
        <p>{{ post.text }}</p>
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
import Cookies from 'js-cookie';

export default {
  name: 'UserPublications',
  props: ['userId'],
  data() {
    return {
      publications: [],
      user: {}
    };
  },
  async created() {
    try {
      const token = Cookies.get('token');
      if (token) {
        const responseUser = await axios.get('http://localhost:8080/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = responseUser.data;
        const responsePublications = await axios.get(`http://localhost:8080/api/publications/user/id/${this.userId}`);
        this.publications = responsePublications.data;
      } else {
        console.error('No se encontró el token en la cookie.');
      }
    } catch (error) {
      console.error('Error al obtener las publicaciones del usuario:', error);
    }
  }
};
</script>

<style scoped>
.profile-post {
  border: 1px solid #e1e1e1;
  padding: 20px;
  margin-bottom: 20px;
}
.post-header {
  display: flex;
  align-items: center;
}
.post-header img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.post-user {
  font-weight: bold;
}
.post-date {
  margin-left: auto;
  color: #888;
}
.post-content {
  margin-top: 10px;
}
.post-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.post-actions .btn {
  display: flex;
  align-items: center;
}
.post-actions .btn i {
  margin-right: 5px;
}
</style>
