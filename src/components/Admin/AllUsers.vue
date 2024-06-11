<template>
  <div>
    <admin-navbar />
    <div class="container-fluid vh-100 d-flex flex-column px-5">
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div class="input-group my-3">
            <span class="input-group-text" id="search-addon">
              <svg class="bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M10.442 10.442a1 1 0 0 1-1.415 0l-.85-.85a5 5 0 1 1 1.415-1.415l.85.85a1 1 0 0 1 0 1.415zm-2.83-6.902a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
            </span>
            <input type="text" class="form-control" placeholder="Search user" aria-label="Search"
              aria-describedby="search-addon" v-model="search" />
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
                      <input class="form-check-input" type="checkbox" :id="'checkbox-' + user.alias" v-model="selectedUsers"
                        :value="user.alias">
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
      <div class="row">
        <div class="col-12 text-end mt-3">
          <button class="btn btn-danger" @click="deleteSelectedUsers">
            Delete Selected Users
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import AdminNavbar from './AdminNavbar.vue';

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
    fetchUsers() {
      const token = Cookies.get('token');
      axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching the users!', error);
        });
    },
    deleteSelectedUsers() {
      const token = Cookies.get('token');
      const confirmDelete = confirm('Are you sure you want to delete the selected users?');
      if (confirmDelete) {
        const promises = this.selectedUsers.map(alias =>
          axios.delete(`http://localhost:8080/api/users/${alias}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        );

        Promise.all(promises)
          .then(() => {
            this.fetchUsers();
            this.selectedUsers = [];
            alert('Selected users deleted successfully.');
          })
          .catch(error => {
            console.error('There was an error deleting the users!', error);
          });
      }
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
</style>
