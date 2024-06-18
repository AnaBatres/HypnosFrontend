<template>
  <div>
    <admin-navbar />
    <div class="container-fluid vh-100 d-flex flex-column px-5">
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Search publication" aria-label="Search"
              aria-describedby="search-addon" v-model="search" />
            <button class="btn btn-danger" @click="deleteSelectedPublications">
              Eliminar
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col">Categories</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="publication in filteredPublications" :key="publication.id">
                  <td style="width: 50px; text-align: center;">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'checkbox-' + publication.id"
                        v-model="selectedPublications" :value="publication.id">
                      <label class="form-check-label ms-2" :for="'checkbox-' + publication.id"></label>
                    </div>
                  </td>
                  <td>{{ publication.title }}</td>
                  <td>{{ publication.user.alias }}</td>
                  <td>
                    <span v-for="(category, index) in publication.categories" :key="index">
                      {{ category.name }}<span v-if="index < publication.categories.length - 1">, </span>
                    </span>
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

export default {
  components: {
    AdminNavbar
  },
  data() {
    return {
      publications: [],
      search: '',
      selectedPublications: []
    };
  },
  computed: {
    filteredPublications() {
      return this.publications.filter(publication =>
        (publication.title && publication.title.toLowerCase().includes(this.search.toLowerCase())) ||
        (publication.author && publication.author.toLowerCase().includes(this.search.toLowerCase())) ||
        (publication.categories && publication.categories.some(category => category.name.toLowerCase().includes(this.search.toLowerCase())))
      );
    }
  },
  methods: {
    async fetchPublications() {
      const response = await axiosInstance.get('/publications');
      this.publications = response.data;
    },
    deleteSelectedPublications() {
      const deletePromises = this.selectedPublications.map(id =>
        axiosInstance.delete('/publications/delete', {
          data: [id]
        })
      );
      Promise.all(deletePromises)
        .then(() => {
          this.fetchPublications();
          this.selectedPublications = [];
        })
    }
  },
  mounted() {
    this.fetchPublications();
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

.form-check-input {
  width: 18px;
  height: 18px;
  border-width: 3px;
  border-color: rgb(60, 60, 60);
}
</style>