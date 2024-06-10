<template>
  <div>
    <Navbar />
    <div class="container mt-4 d-flex justify-content-center">
      <div class="publication-card p-4 shadow-sm">
        <div v-if="loading">
          <p>Cargando...</p>
        </div>
        <div v-else>
          <h1 class="publication-title text-dark">{{ publication.title }}</h1>
          <p>{{ publication.text }}</p>
          <div>
            <span v-for="(category, index) in publication.categories" :key="index" class="badge bg-secondary me-1">{{ category.name }}</span>
          </div>
          <div v-if="!isOwner">
            <div class="mt-4">
              <textarea class="form-control" rows="3" v-model="newComment"></textarea>
              <button class="btn btn-primary mt-2" @click="commentOnPublication">Comentar</button>
            </div>
            <div class="mt-3">
              <button @click="likePublication" class="btn btn-dark">Me gusta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue';
import Cookies from 'js-cookie';


export default {
  name: 'PublicationDetail',
  components: {
    Navbar
  },
  data() {
    return {
      publication: null,
      currentUser: null,
      isOwner: false,
      isLiked: false,
      newComment: '',
      loading: true
    };
  },
  async created() {
    try {
      const token = Cookies.get('token');
      const postId = this.$route.params.id;
      const publicationResponse = await axios.get(`http://localhost:8080/api/publications/id/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
          }
      });
      this.publication = publicationResponse.data;
      await this.fetchCurrentUser();
      this.isOwner = this.publication.user.id === this.currentUser.id;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchCurrentUser() {
      try {
        const userResponse = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            Authorization: `Bearer ${this.getCookie('token')}`
          }
        });
        this.currentUser = userResponse.data;
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
    likePublication() {
      if (!this.isOwner) {
        axios.post(`http://localhost:8080/api/publications/${this.publication.id}/like`)
          .then(response => {
            this.isLiked = !this.isLiked;
            console.log('Publicación likeada');
          })
          .catch(error => {
            console.error('Error al dar "me gusta" a la publicación:', error);
          });
      }
    },
    commentOnPublication() {
      if (!this.isOwner) {
        axios.post(`http://localhost:8080/api/publications/${this.publication.id}/comments`, {
          text: this.newComment
        })
        .then(response => {
          this.publication.comments.push(response.data);
          this.newComment = '';
        })
        .catch(error => {
          console.error('Error al comentar en la publicación:', error);
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.publication-card {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mt-4 {
  margin-top: 1.5rem;
}

.p-4 {
  padding: 1.5rem;
}

.publication-title {
  font-size: 2.5rem;
  color: black;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.comment-section textarea {
  width: 100%;
}

.comment-section button {
  display: block;
  width: 100%;
}

.comments {
  margin-top: 2rem;
}

.comment {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.text-danger {
  color: #dc3545;
}

.heart-icon {
  font-size: 1.5rem;
  color: red;
  cursor: pointer;
}
</style>
