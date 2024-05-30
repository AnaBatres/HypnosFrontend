<template>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              Editar Publicación
            </div>
            <div class="card-body">
              <form @submit.prevent="editPost">
                <div class="mb-3">
                  <label for="content" class="form-label">Contenido</label>
                  <textarea id="content" class="form-control" v-model="postContent" rows="5"></textarea>
                </div>
                <div class="mb-3">
                  <label for="categories" class="form-label">Categorías</label>
                  <div class="selected-categories mt-3">
                    <div v-for="category in selectedCategories" :key="category.id" class="badge bg-info me-2 category-badge">
                      {{ category.name }}
                      <button type="button" class="btn-close" aria-label="Close" @click="removeCategory(category.id)"></button>
                    </div>
                  </div>
                  <select v-model="newCategory" class="form-select mt-2">
                    <option disabled value="">Selecciona una categoría</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Cookies from 'js-cookie';
  
  export default {
    name: 'EditPublication',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const postId = ref(route.params.id);
      const postContent = ref('');
      const selectedCategories = ref([]);
      const categories = ref([]);
      const newCategory = ref('');
  
      // Obtener los detalles de la publicación para mostrar en el formulario
      const getPostDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/publications/id/${postId.value}`);
          const postData = response.data;
          postContent.value = postData.text;
          selectedCategories.value = postData.categories;
        } catch (error) {
          console.error('Error al obtener los detalles de la publicación:', error);
        }
      };
  
      // Obtener las categorías disponibles
      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/categories');
          categories.value = response.data;
        } catch (error) {
          console.error('Error al obtener las categorías:', error);
        }
      };
  
      // Función para eliminar una categoría seleccionada
      const removeCategory = (categoryId) => {
        selectedCategories.value = selectedCategories.value.filter(category => category.id !== categoryId);
      };
  
      // Función para agregar una nueva categoría
      const addCategory = () => {
        const categoryToAdd = categories.value.find(category => category.id === parseInt(newCategory.value));
        if (categoryToAdd && !selectedCategories.value.some(category => category.id === categoryToAdd.id)) {
          selectedCategories.value.push(categoryToAdd);
          newCategory.value = '';
        }
      };
  
      // Función para editar la publicación
      const editPost = async () => {
        try {
          const token = Cookies.get('token');
          if (token) {
            const postData = {
              text: postContent.value,
              categories: selectedCategories.value.map(category => category.id)
            };
            const response = await axios.put(`http://localhost:8080/api/publications/update/${postId.value}`, postData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Publicación editada:', response.data);
            router.push('/profile');
          } else {
            console.error('No se encontró el token en la cookie.');
          }
        } catch (error) {
          console.error('Error al editar la publicación:', error);
          alert('Error al editar la publicación. Por favor, inténtalo de nuevo más tarde.');
        }
      };
  
      // Llamar a las funciones para obtener los detalles de la publicación y las categorías al montar el componente
      getPostDetails();
      fetchCategories();
  
      return {
        postContent,
        selectedCategories,
        categories,
        newCategory,
        editPost,
        removeCategory,
        addCategory
      };
    }
  };
  </script>
  
  <style scoped>
  /* Estilos personalizados para el componente */
  </style>
  