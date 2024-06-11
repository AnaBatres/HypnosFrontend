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
            <div class="mt-3 d-flex justify-content-end">
              <button @click="likePublication" class="btn btn-link text-danger p-0">
                <i class="fa fa-heart-o"></i>
              </button>
            </div>
          </div>
          <div class="comments mt-4">
            <div v-for="(comment, index) in visibleComments" :key="index" class="comment mb-2">
              <p><strong>{{ comment.user.alias }}</strong></p>
              <p>{{ comment.text }}</p>
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
      loading: true,
      publicationComments: [],
      visibleComments: [] 
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
        const response = await axios.get(`http://localhost:8080/api/comments`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        this.publicationComments = response.data;
        this.visibleComments = this.filteredComments.slice(0, 3);
      } catch (error) {
        console.error('Error al obtener los comentarios de la publicación:', error);
      }
    },
    async fetchCurrentUser() {
      try {
        const userResponse = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        });
        this.currentUser = userResponse.data;
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    },
    likePublication() {
      if (!this.isOwner) {
        axios.post(`http://localhost:8080/api/publications/${this.publication.id}/like`, {}, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        })
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
      if (!this.isOwner && this.newComment.trim()) {
        axios.post(`http://localhost:8080/api/comments/create`, {
          text: this.newComment,
          userId: this.currentUser.id,
          publicationId: this.publication.id
        }, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        })
        .then(response => {
          this.publicationComments.unshift(response.data); 
          this.visibleComments = this.filteredComments.slice(0, this.visibleComments.length + 1);
          this.newComment = '';
        })
        .catch(error => {
          console.error('Error al comentar en la publicación:', error);
        });
      }
    },
    loadMoreComments() {
      const currentLength = this.visibleComments.length;
      const moreComments = this.filteredComments.slice(currentLength, currentLength + 3);
      this.visibleComments = this.visibleComments.concat(moreComments);
    },
    showLessComments() {
      if (this.visibleComments.length > 3) {
        this.visibleComments = this.visibleComments.slice(0, this.visibleComments.length - 3);
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
  background-color: #c2c8ce;
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
