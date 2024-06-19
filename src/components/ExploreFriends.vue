<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div class="p-3 mb-4">
        <h2 class="text-center text-white mb-0">Explora los sueños de tus amigos</h2>
      </div>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <div class="row">
          <div v-for="(publication, index) in paginatedPublicationsWithAlias" :key="publication.id" class="col-md-6 mb-4">
            <div class="card h-100" @click="viewPublication(publication.id)">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="alias-header bg-blue text-white">{{ publication.user.alias }}</span>
                  <div class="d-flex align-items-center">
                    <small class="text-muted">
                      <i class="bi bi-heart-fill text-danger"></i> {{ publication.likesCount }}
                      <i class="bi bi-chat ms-3"></i> {{ publication.commentsCount }}
                    </small>
                  </div>
                </div>
                <h5 class="card-title text-dark mt-2">{{ publication.title }}</h5>
              </div>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mt-4">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <a class="page-link bg-dark text-white" href="#" @click.prevent="previousPage">&laquo;</a>
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
</template>

<script>
import Navbar from './Navbar.vue';
import axiosInstance from '../axiosConfig';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      followedUsers: [],
      publications: [],
      paginatedPublications: [],
      loading: false,
      currentPage: 1,
      pageSize: 6,
      currentUserId: null
    };
  },
  async created() {
    this.loading = true;

    try {
      const profileResponse = await axiosInstance.get('/profile/me');
      this.currentUserId = profileResponse.data.id;

      const followingResponse = await axiosInstance.get(`/follow/following/${this.currentUserId}`);
      this.followedUsers = followingResponse.data.map(follow => follow.followed);

      const publicationPromises = this.followedUsers.map(async user => {
        const publicationsResponse = await axiosInstance.get(`/publications/user/id/${user.id}`);
        return publicationsResponse.data;
      });

      const publications = await Promise.all(publicationPromises);
      const uniquePublications = [];
      const publicationSet = new Set();

      publications.flat().forEach(publication => {
        if (publication.userId !== this.currentUserId && !publicationSet.has(publication.id)) {
          publicationSet.add(publication.id);
          uniquePublications.push({
            ...publication,
            likesCount: 0
          });
        }
      });

      this.publications = uniquePublications;

      await Promise.all(this.publications.map(async publication => {
        const alias = await this.getUserAliasByPostId(publication.id);
        if (alias) {
          publication.user = { alias };
        }
        publication.likesCount = await this.getLikesCount(publication.id);
        publication.commentsCount = await this.getCommentsCount(publication.id);
      }));

      this.paginatePublications();

      this.loading = false;
    } catch (error) {
      console.error('Error al obtener publicaciones de los usuarios seguidos:', error);
      this.loading = false;
    }
  },
  methods: {
    async getUserAliasByPostId(postId) {
      try {
        const response = await axiosInstance.get(`/publications/id/${postId}`);
        const publication = response.data;
        return publication.user ? publication.user.alias : null;
      } catch (error) {
        console.error('Error al obtener el alias del usuario por ID de publicación:', error);
        return null;
      }
    },
    async getCommentsCount(postId) {
      try {
        const response = await axiosInstance.get(`/comments/publication/${postId}/count`);
        console.log("likes", response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener la cantidad de likes:', error);
        return 0;
      }
    },
    async getLikesCount(postId) {
      try {
        const response = await axiosInstance.get(`/publications/${postId}/likes`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener la cantidad de likes:', error);
        return 0;
      }
    },
    viewPublication(id) {
      this.$router.push({ name: 'PublicationDetail', params: { id } });
    },
    paginatePublications() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.paginatedPublications = this.publications.slice(startIndex, startIndex + this.pageSize);
    },
    changePage(page) {
      this.currentPage = page;
      this.paginatePublications();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginatePublications();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginatePublications();
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.publications.length / this.pageSize);
    },
    paginatedPublicationsWithAlias() {
      return this.paginatedPublications.filter(publication => publication.user && publication.user.alias);
    }
  }
};
</script>


<style scoped>
.p-3{
  background-color: #5e0086;
}
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

.alias-header {
  background-color: #b300ff;
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px;
}

.me-2 {
  margin-right: 0.5rem;
}
.card {
  cursor: pointer;
  transition: transform 0.2s;
}
.card:hover {
  background-color: #f8f9fa;
  transform: translateY(-5px);
}
</style>
