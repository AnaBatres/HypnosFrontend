<template>
  <div>
    <admin-navbar />
    <div class="container-fluid vh-100 d-flex flex-column px-5">
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Search category" aria-label="Search"
              aria-describedby="search-addon" v-model="search" />
            <button class="btn btn-danger" @click="deleteSelectedPublications">
              Eliminar
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in filteredCategories" :key="category.id">
                  <td>{{ category.id }}</td>
                  <td>{{ category.name }}</td>
                  <td>{{ category.description }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm me-2" @click="editCategory(category)">Editar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-end mt-3">
          <button class="btn btn-success" @click="showAddCategoryModal">Add Category</button>
        </div>
      </div>
    </div>
    <div class="modal" tabindex="-1" role="dialog" :class="{ 'show': addCategoryModalOpen }">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Category</h5>
            <button type="button" class="btn-close" @click="closeAddCategoryModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Category Name</label>
                <input type="text" class="form-control" id="categoryName" v-model="newCategoryName">
              </div>
              <button type="submit" class="btn btn-primary">Save</button>
            </form>
          </div>
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
      categories: [],
      search: '',
      addCategoryModalOpen: false,
      newCategoryName: ''
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    async fetchCategories() {
      const response = await axiosInstance.get('/categories');
      this.categories = response.data;
    },
    async deleteCategory(categoryId) {
      await axiosInstance.delete(`/categories/${categoryId}`);
      this.fetchCategories();
    },
    async addCategory() {
      await axiosInstance.post('/categories', { name: this.newCategoryName });
      this.fetchCategories();
    },
    editCategory(category) {
      this.$router.push({ name: 'editCategory', params: { id: category.id } });
    }
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>

<style>
.container-fluid {
  padding-left: 30px;
  padding-right: 30px;
}

.vh-100 {
  height: 100vh;
}

.overflow-auto {
  overflow: auto;
}
</style>
