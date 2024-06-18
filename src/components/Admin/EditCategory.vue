<template>
  <div>
    <admin-navbar />
    <div class="container-fluid">
      <div class="row flex-grow-1 justify-content-center align-items-center w-100">
        <div class="col-md-8">
          <form @submit.prevent="updateCategory" class="card p-4">
            <h3 class="mb-4">Editar Categoría</h3>
            <div class="mb-3">
              <label for="name" class="form-label">Nombre de la categoría</label>
              <input type="text" class="form-control" id="name" v-model="editedCategory.name" required>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Descripción</label>
              <textarea class="form-control" id="description" v-model="editedCategory.description" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from './AdminNavbar.vue';
import axiosInstance from '../../axiosConfig';

export default {
  components: {
    AdminNavbar
  },
  data() {
    return {
      editedCategory: {
        id: null,
        name: '',
        description: ''
      }
    };
  },
  methods: {
    async fetchCategoryDetails() {
      const categoryId = this.$route.params.id;
      const response = await axiosInstance.get(`/categories/${categoryId}`);
      this.editedCategory = response.data;
    },
    async updateCategory() {
      const categoryId = this.$route.params.id;
      await axiosInstance.put(`/categories/${categoryId}`, this.editedCategory);
      this.$router.push(`/allCategories`);
    }
  },
  mounted() {
    this.fetchCategoryDetails();
  }
};
</script>

<style>
.container-fluid {
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 50px
}

.overflow-auto {
  overflow: auto;
}
</style>