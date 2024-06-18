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
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span v-for="(category, index) in publication.categories" :key="index" class="badge bg-secondary me-1">{{ category.name }}</span>
            </div>
            <div class="d-flex align-items-center">
              <button @click="likePublication" class="btn btn-link text-danger p-0 me-2">
                <i :class="isLiked ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'" class="heart-icon"></i>
              </button>
              <span>{{ likesCount }}</span>
            </div>
          </div>
          <div class="mt-4">
            <textarea class="form-control" rows="3" v-model="newComment" placeholder="Escribe un comentario..."></textarea>
            <button class="btn btn-primary mt-2" @click="commentOnPublication">Comentar</button>
          </div>
          <div class="comments mt-4">
            <div v-for="(comment, index) in visibleComments" :key="index" class="comment mb-2 d-flex justify-content-between align-items-start">
              <div>
                <p><strong>{{ comment.user.alias }}</strong></p>
                <p>{{ comment.text }}</p>
              </div>
              <button v-if="comment.user.id === currentUser.id" @click="confirmDeleteComment(comment.id)" class="btn btn-link p-0 text-danger">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
            <div class="d-flex justify-content-between">
              <button v-if="visibleComments.length < filteredComments.length" @click="loadMoreComments" class="btn btn-link">Ver más</button>
              <button v-if="visibleComments.length > 3" @click="showLessComments" class="btn btn-link">Mostrar menos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '../axiosConfig';
import Navbar from './Navbar.vue';
import Swal from 'sweetalert2';

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
      likesCount: 0,
      newComment: '',
      loading: true,
      publicationComments: [],
      visibleComments: []
    };
  },
  async created() {
    try {
      const postId = this.$route.params.id;
      const publicationResponse = await axiosInstance.get(`/publications/id/${postId}`);
      this.publication = publicationResponse.data;
      await this.fetchCurrentUser();
      this.isOwner = this.publication.user.id === this.currentUser.id;

      const userLikesResponse = await axiosInstance.get(`/publications/liked/${this.currentUser.id}`);
      this.isLiked = userLikesResponse.data.some(pub => pub.id === this.publication.id);

      await this.updateLikesCount();
      await this.getPublicationComments();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    filteredComments() {
      return this.publicationComments.filter(comment => comment.publication.id === this.publication.id);
    }
  },
  methods: {
    async getPublicationComments() {
      try {
        const response = await axiosInstance.get(`/comments`);
        this.publicationComments = response.data;
        this.visibleComments = this.filteredComments.slice(0, 2);
      } catch (error) {
        console.error('Error al obtener los comentarios de la publicación:', error);
      }
    },
    async fetchCurrentUser() {
      try {
        const userResponse = await axiosInstance.get('/profile/me');
        this.currentUser = userResponse.data;
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    },
    async likePublication() {
      const likeData = {
        userId: this.currentUser.id,
        like: !this.isLiked
      };
      try {
        await axiosInstance.patch(`/publications/${this.publication.id}/like`, likeData);
        this.isLiked = !this.isLiked;
        await this.updateLikesCount();
        console.log('Publicación likeada');
      } catch (error) {
        console.error('Error al dar "me gusta" a la publicación:', error);
        if (error.response && error.response.status === 403) {
          console.error('Acceso prohibido: asegúrate de que tienes permisos para acceder a esta información.');
        }
      }
    },
    async updateLikesCount() {
      try {
        const likesCountResponse = await axiosInstance.get(`/publications/${this.publication.id}/likes`);
        if (typeof likesCountResponse.data === 'number') {
          this.likesCount = likesCountResponse.data;
        } else if (Array.isArray(likesCountResponse.data)) {
          this.likesCount = likesCountResponse.data.length;
        } else {
          console.error('Invalid response format for likes:', likesCountResponse.data);
        }
      } catch (error) {
        console.error('Error al actualizar el conteo de likes:', error);
      }
    },
    async commentOnPublication() {
      if (this.newComment.trim()) {
        try {
          const response = await axiosInstance.post(`/comments/create`, {
            text: this.newComment,
            userId: this.currentUser.id,
            publicationId: this.publication.id
          });
          this.publicationComments.unshift(response.data);
          this.visibleComments = this.filteredComments.slice(0, this.visibleComments.length + 1);
          this.newComment = '';
        } catch (error) {
          console.error('Error al comentar en la publicación:', error);
        }
      }
    },
    confirmDeleteComment(commentId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.deleteComment(commentId);
        }
      });
    },
    async deleteComment(commentId) {
      try {
        await axiosInstance.delete(`/comments/${commentId}`);
        this.publicationComments = this.publicationComments.filter(comment => comment.id !== commentId);
        this.visibleComments = this.filteredComments.slice(0, this.visibleComments.length);
      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
      }
    },
    loadMoreComments() {
      const currentLength = this.visibleComments.length;
      const moreComments = this.filteredComments.slice(currentLength, currentLength + 2);
      this.visibleComments = this.visibleComments.concat(moreComments);
    },
    showLessComments() {
      if (this.visibleComments.length > 2) {
        this.visibleComments = this.visibleComments.slice(0, this.visibleComments.length - 2);
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
  max-width: 1000px;
  width: 100%;
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mt-4 {
  margin-top: 1.5rem;
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
  width: 100%;
}

.comment {
  background-color: #e4e5e7;
  padding: 1rem;
  border-radius: 4px;
}

.text-danger {
  color: #dc3545;
}

.heart-icon {
  font-size: 1.5rem;
  cursor: pointer;
}

.ms-2 {
  margin-left: 0.5rem;
}
</style>
