<template>
  <div>
    <admin-navbar />
    <div class="container-fluid d-flex flex-column px-5">
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div class="input-group my-3">
            <input type="text" class="form-control" placeholder="Busca el usuario" aria-label="Search"
              aria-describedby="search-addon" v-model="search" />
            <button class="btn btn-danger" @click="deleteSelectedUsers">
              Eliminar
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.alias">
                  <td>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'checkbox-' + user.alias"
                        v-model="selectedUsers" :value="user.alias">
                      <label class="form-check-label ms-2" :for="'checkbox-' + user.alias"></label>
                    </div>
                  </td>
                  <td>{{ user.firstname }}</td>
                  <td>{{ user.lastname }}</td>
                  <td>{{ user.alias }}</td>
                  <td>{{ user.email }}</td>
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
      users: [],
      search: '',
      selectedUsers: []
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(this.search.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(this.search.toLowerCase())) ||
        (user.alias && user.alias.toLowerCase().includes(this.search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.search.toLowerCase()))
      );
    }
  },
  methods: {
    async fetchUsers() {
      const response = await axiosInstance.get('/users');
      this.users = response.data;
    },
    deleteSelectedUsers() {
      const deletePromises = this.selectedUsers.map(alias => {
        return axiosInstance.delete(`/users/delete/${alias}`);
      });

      Promise.all(deletePromises)
        .then(() => {
          this.fetchUsers();
          this.selectedUsers = [];
          alert('Selected users deleted successfully.');
        })
    }
  },
  mounted() {
    this.fetchUsers();
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
