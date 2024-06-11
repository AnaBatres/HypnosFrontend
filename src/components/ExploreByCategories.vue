<template>
    <div class="container">
      <div class="category-buttons">
        <button v-for="category in categories" :key="category.id" @click="toggleCategory(category.id)"
                :class="{ active: selectedCategories.includes(category.id) }">
          {{ category.name }}
        </button>
      </div>
      <div class="publications">
        <div class="publication" v-for="publication in filteredPublications" :key="publication.id">
          <div class="publication-content">
            <h3>{{ publication.title }}</h3>
            <p>{{ publication.user.alias }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
  export default {
    data() {
      return {
        categories: [],
        publications: [],
        selectedCategories: [],
      };
    },
    async created() {
      await this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        try {
          const token = Cookies.get('token');
          const response = await axios.get('http://localhost:8080/api/categories', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          this.categories = response.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },
      async toggleCategory(categoryId) {
        if (this.selectedCategories.includes(categoryId)) {
          this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
        } else {
          this.selectedCategories.push(categoryId);
        }
  
        try {
          const token = Cookies.get('token');
          const response = await axios.get(`http://localhost:8080/api/publications/categories`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            params: {
              categoryIds: this.selectedCategories.join(',')
            }
          });
          this.publications = response.data;
        } catch (error) {
          console.error('Error fetching publications by category:', error);
        }
      },
    },
    computed: {
      filteredPublications() {
        if (this.selectedCategories.length === 0) {
          return this.publications;
        } else {
          return this.publications.filter(publication =>
            publication.categories.some(category => this.selectedCategories.includes(category.id))
          );
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .category-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .category-buttons button {
    flex: 0 0 auto;
    margin-bottom: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
  }
  
  .category-buttons button.active {
    background-color: blue;
  }
  
  .publications {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .publication {
    width: 30%;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .publication-content {
    text-align: center;
  }
  
  .publication h3 {
    margin-bottom: 8px;
  }
  
  .publication p {
    margin-bottom: 0;
    color: #888;
  }
  </style>
  