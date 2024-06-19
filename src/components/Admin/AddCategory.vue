<template>
    <div>
        <admin-navbar />
        <div class="container">
            <div class="create-category-container mt-5">
                <h2>Creación de categorias</h2>
                <form @submit.prevent="createCategory">
                    <div class="mb-3">
                        <label for="categoryName" class="form-label">Nombre de la categoría</label>
                        <input type="text" class="form-control" id="categoryName" v-model="categoryName" required>
                    </div>
                    <div class="mb-3">
                        <label for="categoryDescription" class="form-label">Descripción de la categoría</label>
                        <textarea class="form-control" id="categoryDescription" v-model="categoryDescription" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Crear</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '../../axiosConfig';
import Swal from 'sweetalert2';
import AdminNavbar from './AdminNavbar.vue';

export default {
    name: 'CreateCategory',
    components: {
        AdminNavbar
    },
    data() {
        return {
            categoryName: '',
            categoryDescription: ''
        };
    },
    methods: {
        async createCategory() {
            const newCategory = {
                name: this.categoryName,
                description: this.categoryDescription
            };
            const response = await axiosInstance.post('/categories', newCategory);
            if (response.status === 201) {
                await Swal.fire({
                    title: 'Perfecto!',
                    text: 'Categoria creada correctamente',
                    icon: 'success'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push('/allCategories');
                    } else {
                        this.categoryName = '';
                        this.categoryDescription = '';
                    }
                });
            }
        }
    }
};
</script>

<style scoped>
.create-category-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 40px;
}

.mb-3 {
    margin-bottom: 1rem;
}
</style>