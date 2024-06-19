<template>
  <div id="app" class="no-bg">
    <Navbar />
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <img id="avatarPreview" src="../assets/perro.jpg" alt="Profile Picture"
                class="rounded-circle mb-3 border" style="border-width: 2px; width: 150px; height: 150px;">
              <h5 class="card-title">{{ user?.firstname || 'Usuario' }}</h5>
              <p class="card-text">{{ user?.alias || 'Alias' }}</p>
              <div class="d-flex justify-content-around mt-4">
                <div>
                  <h6 class="text-muted">Siguiendo</h6>
                  <h4 class="display-4 text-primary">{{ followingCount }}</h4>
                </div>
                <div>
                  <h6 class="text-muted">Seguidores</h6>
                  <h4 class="display-4 text-primary">{{ followersCount }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeTab === 'publications' }" href="#"
                    @click.prevent="setActiveTab('publications')">Publicaciones</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeTab === 'followers' }" href="#"
                    @click.prevent="setActiveTab('followers')">Seguidores</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ active: activeTab === 'following' }" href="#"
                    @click.prevent="setActiveTab('following')">Seguidos</a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div v-if="activeTab === 'publications'">
                <div v-if="!publications || publications.length === 0" class="text-center mt-4">
                  <p>No hay publicaciones.</p>
                </div>
                <div v-else>
                  <div v-for="post in publications" :key="post.id" class="card mb-3 shadow-sm">
                    <router-link :to="'/publication/' + post.id" class="text-decoration-none">
                      <div class="card-header">
                        <h5 class="card-title text-center text-dark">{{ post.title }}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <small class="text-muted">
                              <i class="bi bi-heart-fill text-danger"></i> {{ post.likesCount }}
                              <i class="bi bi-chat ms-3"></i> {{ post.commentsCount }}
                            </small>
                          </div>
                          <div>
                            <button class="btn btn-danger btn-sm" @click="confirmDelete(post.id)"> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
              <div v-if="activeTab === 'followers'">
                <div v-if="followers.length > 0" class="row">
                  <div v-for="follower in followers" :key="follower.id" class="col-md-6 mb-3">
                    <div class="card shadow-sm">
                      <div class="card-body d-flex align-items-center">
                        <img src="../assets/perfil.jpg" alt="Follower Avatar" class="rounded-circle me-3"
                          style="width: 50px; height: 50px;">
                        <div>
                          <router-link :to="'/profile/' + follower.alias" class="text-decoration-none">
                            <h5 class="card-title mb-0">{{ follower.alias }}</h5>
                          </router-link>
                          <p class="text-muted mb-0">{{ follower.firstname }} {{ follower.lastname }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>No hay seguidores.</p>
                </div>
              </div>
              <div v-if="activeTab === 'following'">
                <div v-if="followings.length > 0" class="row">
                  <div v-for="following in followings" :key="following.id" class="col-md-6 mb-3">
                    <div class="card shadow-sm">
                      <div class="card-body d-flex align-items-center">
                        <img src="../assets/perfil.jpg" alt="Following Avatar" class="rounded-circle me-3"
                          style="width: 50px; height: 50px;">
                        <div>
                          <router-link :to="'/profile/' + following.alias" class="text-decoration-none">
                            <h5 class="card-title mb-0">{{ following.alias }}</h5>
                          </router-link>
                          <p class="text-muted mb-0">{{ following.firstname }} {{ following.lastname }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>No hay seguidos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './Navbar.vue';
import Swal from 'sweetalert2';
import axiosInstance from '../axiosConfig';

export default {
  name: 'Profile',
  components: {
    Navbar
  },
  data() {
    return {
      user: {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        alias: '',
        password: '',
      },
      avatarPreviewUrl: '',
      publications: [],
      followers: [],
      followings: [],
      selectedFile: null,
      followingCount: 0,
      followersCount: 0,
      activeTab: 'publications'
    };
  },
  async created() {
    try {
      const response = await axiosInstance.get('/profile/me');
      const userData = response.data;
      console.log(userData);

      this.user = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        alias: userData.alias,
        password: userData.password,
      };

      const publicationsResponse = await axiosInstance.get(`/publications/user/id/${this.user.id}`);
      this.publications = publicationsResponse.data;

      for (let i = 0; i < this.publications.length; i++) {
        const postId = this.publications[i].id;
        const likesCountResponse = await axiosInstance.get(`/publications/${postId}/likes`);
        this.publications[i].likesCount = likesCountResponse.data;

        const commentsCountResponse = await axiosInstance.get(`/comments/publication/${postId}/count`);
        this.publications[i].commentsCount = commentsCountResponse.data;
      }

      this.getFollowData();
      console.log(this.followers);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      if (error.response && error.response.status === 401) {
        this.$router.push('/login');
      } else {
        alert('Error al cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  },

  methods: {
    async getFollowData() {
      try {
        const followersResponse = await axiosInstance.get(`/follow/followers/${this.user.id}`);
        const followingResponse = await axiosInstance.get(`/follow/following/${this.user.id}`);

        this.followers = followersResponse.data.map(follow => follow.follower);
        this.followings = followingResponse.data.map(follow => follow.followed);

        console.log("Followers:", this.followers);
        console.log("Following:", this.followings);

        this.followersCount = this.followers.length;
        this.followingCount = this.followings.length;
      } catch (error) {
        console.error('Error al obtener los datos de seguidores y seguidos:', error);
      }
    },
    async confirmDelete(postId) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      });

      if (result.isConfirmed) {
        this.deletePost(postId);
      }
    },
    async deletePost(postId) {
      try {
        await axiosInstance.delete(`/publications/${postId}`);
        this.publications = this.publications.filter(post => post.id !== postId);

        Swal.fire({
          icon: 'success',
          title: 'Publicación eliminada',
          text: 'La publicación se ha eliminado correctamente.'
        }).then(() => {
          this.$forceUpdate();
        });
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar la publicación. Por favor, inténtalo de nuevo más tarde.'
        });
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style scoped>
.icon {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.no-bg {
  background-color: white;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

img.rounded-circle {
  border: 2px solid #ddd;
  padding: 5px;
}

.nav-tabs .nav-link.active {
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #fff;
}

.display-4 {
  font-size: 1.5rem;
  font-weight: bold;
}

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  font-size: 1rem;
  color: #000000 !important;
}
</style>
