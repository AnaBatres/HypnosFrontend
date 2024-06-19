<template>
  <div>
    <admin-navbar />
    <div class="container-fluid vh-100 d-flex flex-column px-5">
      <div class="input-group my-3">
        <input type="text" class="form-control" placeholder="Busca la categoría" aria-label="Search"
          aria-describedby="search-addon" v-model="search" />
        <button class="btn btn-danger" @click="deleteSelectedCategories">
          Eliminar
        </button>
        <router-link to="/addCategory">
          <button class="btn btn-success">
            Añadir Categoría
          </button>
        </router-link>
      </div>
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in filteredCategories" :key="category.id">
                  <td>
                    <input type="checkbox" class="form-check-input" v-model="selectedCategories" :value="category.id">
                  </td>
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
    </div>
  </div>
</template>


<script>
import AdminNavbar from './AdminNavbar.vue';
import axiosInstance from '../../axiosConfig';
import Swal from 'sweetalert2';

export default {
  components: {
    AdminNavbar
  },
  data() {
    return {
      categories: [],
      search: '',
      selectedCategories: [],
      selectAll: false, 
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
      try {
        const response = await axiosInstance.get('/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    editCategory(category) {
      this.$router.push({ name: 'editCategory', params: { id: category.id } });
    },
    async deleteSelectedCategories() {
      if (this.selectedCategories.length === 0) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, selecciona al menos una categoría para eliminar.',
          icon: 'error'
        });
        return;
      }

      const confirmation = await Swal.fire({
        title: '¿Estás seguro de que deseas eliminar las categorías seleccionadas?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        icon: 'warning',
        reverseButtons: true
      });

      if (confirmation.isConfirmed) {
        const deletePromises = this.selectedCategories.map(id =>
          axiosInstance.delete(`/categories/${id}`)
        );
        await Promise.all(deletePromises);
        await Swal.fire({
          title: 'Éxito',
          text: 'Las categorías seleccionadas han sido eliminadas correctamente.',
          icon: 'success'
        });
        this.fetchCategories();
        this.selectedCategories = [];
        this.selectAll = false;
    }
  },
  selectAllCategories() {
    if (this.selectAll) {
      this.selectedCategories = this.categories.map(category => category.id);
    } else {
      this.selectedCategories = [];
    }
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


.form-check-input {
  width: 18px;
  height: 18px;
  border-width: 3px;
  border-color: rgb(60, 60, 60);
}
</style>
