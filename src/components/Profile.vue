<template>
  <div id="app" class="no-bg">
    <Navbar />
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <img id="avatarPreview" src="../imagenes/images2.jpg" alt="Profile Picture"
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
                        <h5 class="card-title text-center">{{ post.title }}</h5>
                        <div class="d-flex justify-content-center mt-3">
                          <button class="btn btn-outline-danger btn-sm me-2"><i class="bi bi-arrow-bar-up"></i>
                            Compartir</button>
                          <router-link :to="'/edit-publication/' + post.id"
                            class="btn btn-outline-danger btn-sm me-2">Editar</router-link>
                          <button class="btn btn-danger btn-sm me-2" @click="deletePost(post.id)">Eliminar</button>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
              <div v-if="activeTab === 'followers'">
                <ul v-if="followers">
                  <li v-for="follower in followers" :key="follower.id">{{ follower.alias }}</li>
                </ul>
                <div v-else>
                  <p>No hay seguidores.</p>
                </div>
              </div>
              <div v-if="activeTab === 'following'">
                <ul v-if="followings">
                  <li v-for="following in followings" :key="following.id">
                    <router-link :to="'/profile/' + following.alias">{{ following.alias }}</router-link>
                  </li>
                </ul>
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
import axios from 'axios';
import Cookies from 'js-cookie';
import { RouterLink } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './Navbar.vue';
import Swal from 'sweetalert2';

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
        search: '',
        dreamCategories: []
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
      const token = Cookies.get('token');
      if (token) {
        const response = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const userData = response.data;
        console.log(userData);

        this.user = {
          id: userData.id,
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          alias: userData.alias,
          password: userData.password,
          dreamCategories: userData.dreamCategories
        };

        // Obtener publicaciones del usuario
        const publicationsResponse = await axios.get(`http://localhost:8080/api/publications/user/id/${this.user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.publications = publicationsResponse.data;

        // Actualiza los detalles de cada publicación dentro de la misma promesa
        this.publications.forEach(post => {
          post.likes = post.likedByUsers;
          post.comments = post.comments;
          post.categories = post.categories;
        });

        this.getFollowData();
      } else {
        console.error('No se encontró el token en la cookie.');
        this.$router.push('/login');
      }
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
        const token = Cookies.get('token');
        if (token) {
          const followingResponse = await axios.get(`http://localhost:8080/api/users/${this.user.alias}/following`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const followersResponse = await axios.get(`http://localhost:8080/api/users/${this.user.alias}/followers`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          this.followings = followingResponse.data || [];
          this.followers = followersResponse.data || [];
          this.followingCount = this.followings.length;
          this.followersCount = this.followers.length;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de seguidores y seguidos:', error);
      }
    },
    async updateProfile() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const userId = this.user.id;
          const formData = new FormData();
          formData.append('email', this.user.email);
          if (this.user.password) {
            formData.append('password', this.user.password);
          }
          if (this.selectedFile) {
            formData.append('avatar', this.selectedFile);
          }

          const response = await axios.put(`http://localhost:8080/api/users/id/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          this.user = response.data;
          alert('Perfil actualizado exitosamente');
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
      }
    },
    async deletePost(postId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará permanentemente la publicación.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = Cookies.get('token');
            if (token) {
              await axios.delete(`http://localhost:8080/api/publications/id/${postId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              this.publications = this.publications.filter(post => post.id !== postId);
            } else {
              console.error('No se encontró el token en la cookie.');
            }
          } catch (error) {
            console.error('Error al eliminar la publicación:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar la publicación. Por favor, inténtalo de nuevo más tarde.'
            });
          }
        }
      });
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.avatarPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
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
