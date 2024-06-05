<template>
  <div>
    <Navbar />
    <!-- Contenido principal -->
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Comparte tu sueño</h2>
              <form @submit.prevent="createPost" class="form">
                <div class="mb-3">
                  <label for="title" class="form-label">¿Qué has soñado?</label>
                  <input id="title" v-model="form.title" class="form-control" type="text"
                    placeholder="Ponle un título a tu sueño" required>
                </div>
                <div class="mb-3">
                  <label for="text" class="form-label">Cuéntanos sobre tu sueño</label>
                  <textarea id="text" v-model="form.text" class="form-control" rows="5"
                    placeholder="Describe tu sueño aquí..." required></textarea>
                </div>
                <div class="mb-3">
                  <label for="categories" class="form-label">Categorías</label>
                  <select id="categories" v-model="selectedCategory" class="form-select" @change="addCategory">
                    <option value="" disabled selected>Selecciona una categoría</option>
                    <option v-for="category in availableCategories" :key="category.id" :value="category.id">
                      {{ category.name }}</option>
                  </select>
                  <div class="selected-categories mt-3">
                    <span v-for="categoryId in form.categoryIds" :key="categoryId"
                      class="badge bg-info me-2 category-badge">
                      {{ getCategoryName(categoryId) }}
                      <button type="button" class="btn-close" aria-label="Close"
                        @click="removeCategory(categoryId)"></button>
                    </span>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">Compartir sueño</button>
              </form>
              <div v-if="message" class="mt-3 alert alert-success">{{ message }}</div>
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
import Swal from 'sweetalert2';
import Navbar from './Navbar.vue';

export default {
  name: 'CreatePost',
  components: {
    Navbar
  },
  data() {
    return {
      form: {
        title: '',
        text: '',
        categoryIds: [],
        userId: null
      },
      categories: [],
      selectedCategory: null,
      message: ''
    };
  },
  created() {
    this.fetchCategories();
    this.fetchUserId();
  },
  computed: {
    availableCategories() {
      return this.categories.filter(category => !this.form.categoryIds.includes(category.id));
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchUserId() {
      const token = Cookies.get('token');
      try {
        const response = await axios.get('http://localhost:8080/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.form.userId = response.data.id;
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    },
    addCategory() {
      if (this.selectedCategory && !this.form.categoryIds.includes(this.selectedCategory)) {
        this.form.categoryIds.push(this.selectedCategory);
      }
      this.selectedCategory = null;
    },
    removeCategory(categoryId) {
      this.form.categoryIds = this.form.categoryIds.filter(id => id !== categoryId);
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Unknown';
    },
    async createPost() {
      const token = Cookies.get('token');
      try {
        const response = await axios.post(
          'http://localhost:8080/api/publications/create',
          {
            title: this.form.title,
            text: this.form.text,
            categoryIds: this.form.categoryIds,
            userId: this.form.userId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        await Swal.fire({
          title: '¡Éxito!',
          text: 'La publicación se ha creado correctamente. ¿Quieres volver a tu perfil?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push('/profile');
          } else {
            this.form.title = '';
            this.form.text = '';
            this.form.categoryIds = [];
          }
        });
        
      } catch (error) {
        console.error('Error creating post:', error);
        this.message = 'Failed to create post.';
      }
    }
  }
};
</script>

<style scoped>
.dream-post {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e3e8ee;
  border-radius: 8px;
  background-color: #f8fafc;
}

h2 {
  margin-top: 0;
  color: #4a5568;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  color: #4a5568;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
}

.selected-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  background-color: #edf2f7;
  padding: 6px 10px;
  border-radius: 16px;
  color: #4a5568;
}

.category-badge {
  font-size: 0.9rem;
}

.remove-button {
  margin-left: 8px;
  border: none;
  background-color: transparent;
  color: #a0aec0;
  cursor: pointer;
}

.submit-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4299e1;
  color: #fff;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #2b6cb0;
}

.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  background-color: #ebf8ff;
  color: #3182ce;
}
</style>
