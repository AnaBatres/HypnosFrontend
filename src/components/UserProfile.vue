<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <img id="avatarPreview" src="../imagenes/images2.jpg" alt="Profile Picture"
                class="rounded-circle mb-3 border" style="border-width: 2px; width: 150px; height: 150px;">
              <h1 class="profile-name">{{ user.firstname }} {{ user.lastname }}</h1>
              <p class="profile-alias">{{ user.alias }}</p>
              <div class="d-flex justify-content-center mt-3">
                <button :class="isFollowing ? 'btn btn-secondary btn-sm me-2' : 'btn btn-primary btn-sm me-2'"
                        @click="followOrUnfollow(user.id)">
                  <i :class="isFollowing ? 'bi bi-person-check-fill' : 'bi bi-person-plus-fill'"></i>
                  {{ isFollowing ? 'Siguiendo' : 'Seguir' }}
                </button>
                <button class="btn btn-danger btn-sm" @click="blockUser(user.id)">
                  <i class="bi bi-person-x-fill"></i> Bloquear
                </button>
              </div>
              <div class="d-flex justify-content-around mt-4">
                <div>
                  <h6 class="text-muted">Siguiendo</h6>
                  <h4 class="display-8 text-primary">{{ followingCount }}</h4>
                </div>
                <div>
                  <h6 class="text-muted">Seguidores</h6>
                  <h4 class="display-8 text-primary">{{ followersCount }}</h4>
                </div>
              </div>
              <h2 class="section-title mt-4">Publicaciones</h2>
              <div v-if="publications.length === 0" class="text-center mt-4">
                <p>No hay publicaciones.</p>
              </div>
              <div v-else>
                <div v-for="post in publications" :key="post.id" class="card mb-3">
                  <router-link :to="'/publication/' + post.id" class="text-decoration-none">
                    <div class="card-header text-center">
                      <h5 class="card-title">{{ post.title }}</h5>
                      <p class="card-text"><small class="text-muted"><i class="bi bi-heart text-danger"></i> {{
                        post.likesCount }}</small></p>
                    </div>
                  </router-link>
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
import Navbar from './Navbar.vue';

export default {
  name: 'UserProfile',
  components: {
    Navbar
  },
  data() {
    return {
      user: {},
      publications: [],
      isFollowing: false,
      searchQuery: '',
      followers: [],
      followings: [],
      followingCount: 0,
      followersCount: 0,
      currentUser: {},
      currentFollowings: []
    };
  },
  async created() {
    try {
      const alias = this.$route.params.alias;
      const token = Cookies.get('token');
      if (token) {
        const userResponse = await axios.get(`http://localhost:8080/api/users/${alias}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.user = userResponse.data;

       
        await this.getCurrentUser();
        await this.getFollowData();
        await this.getCurrentUserFollowings();

        this.isFollowing = this.currentFollowings.some(following => following.followed.id === this.user.id);

        const publicationsResponse = await axios.get(`http://localhost:8080/api/publications/user/${this.user.alias}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.publications = publicationsResponse.data;
      } else {
        console.error('No se encontró el token en la cookie.');
      }
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error);
    }
  },

  methods: {
    async getFollowData() {
      try {
        const token = Cookies.get('token');
        if (token) {
       
          const followingResponse = await axios.get(`http://localhost:8080/api/follow/following/${this.user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const followersResponse = await axios.get(`http://localhost:8080/api/follow/followers/${this.user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          this.followings = followingResponse.data;
          this.followers = followersResponse.data;
          this.followingCount = this.followings.length;
          this.followersCount = this.followers.length;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de seguidores y seguidos:', error);
      }
    },
    async getCurrentUserFollowings() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const currentFollowingResponse = await axios.get(`http://localhost:8080/api/follow/following/${this.currentUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          this.currentFollowings = currentFollowingResponse.data;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de seguidos del usuario actual:', error);
      }
    },
    async followOrUnfollow(userId) {
      try {
        const token = Cookies.get('token');
        if (this.isFollowing) {
         
          await axios.delete(`http://localhost:8080/api/follow/${this.currentUser.id}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
         
          await axios.post(`http://localhost:8080/api/follow/${this.currentUser.id}/${userId}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
        this.isFollowing = !this.isFollowing;
        await this.getFollowData();
        await this.getCurrentUserFollowings();
      } catch (error) {
        console.error('Error al seguir o dejar de seguir al usuario:', error);
      }
    },
    async getCurrentUser() {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/api/profile/me', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          this.currentUser = response.data;
        } else {
          console.error('No se encontró el token en la cookie.');
        }
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    },
    redirectToUserProfile() {
      this.$router.push(`/user/${this.searchQuery}`);
    },
    confirmLogout() {
      Cookies.remove('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
}

.profile-alias {
  font-size: 18px;
  color: #6e7478;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-title {
  color: #007bff;
}

.text-muted {
  font-size: 1rem;
  color: #000000 !important;
}
</style>
