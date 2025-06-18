<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>My Recipes</h2>
      <button 
        class="btn btn-primary"
        @click="openCreateRecipe"
      >
        <i class="bi bi-plus-circle"></i> Create New Recipe
      </button>
    </div>

    <div v-if="!store.getters.username" class="text-center py-5">
      <h3>Please log in to view your recipes</h3>
      <p class="text-muted mb-4">Sign in to see and manage your recipes</p>
      <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
      <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="recipes.length > 0" class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="recipe in recipes" :key="recipe.id" class="col">
          <div class="card h-100">
            <img 
              :src="recipe.image" 
              class="card-img-top" 
              :alt="recipe.title"
              style="height: 200px; object-fit: cover;"
            >
            <div class="card-body">
              <h5 class="card-title">{{ recipe.title }}</h5>
              <p class="card-text text-muted">
                <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} min
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    @click="editRecipe(recipe)"
                  >
                    Edit
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteRecipe(recipe.id)"
                  >
                    Delete
                  </button>
                </div>
                <small class="text-muted">
                  Created {{ formatDate(recipe.createdAt) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h3>No recipes yet</h3>
        <p class="text-muted mb-4">Start creating your own recipes!</p>
        <button 
          class="btn btn-primary"
          @click="openCreateRecipe"
        >
          Create Your First Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';

export default {
  name: 'MyRecipesPage',
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    const recipes = ref([]);
    const loading = ref(true);

    const fetchRecipes = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`${store.getters.server_domain}/recipes/my-recipes`);
        recipes.value = response.data;
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast('Error', 'Failed to load your recipes', 'error');
      } finally {
        loading.value = false;
      }
    };

    const openCreateRecipe = () => {
      store.commit('setShowCreateRecipeModal', true);
    };

    // eslint-disable-next-line no-unused-vars
    const editRecipe = (_) => {
      // TODO: Implement edit functionality
      toast('Coming Soon', 'Recipe editing will be available soon!', 'info');
    };

    const deleteRecipe = async (recipeId) => {
      if (!confirm('Are you sure you want to delete this recipe?')) return;

      try {
        await axios.delete(`${store.getters.server_domain}/recipes/${recipeId}`);
        recipes.value = recipes.value.filter(r => r.id !== recipeId);
        toast('Success', 'Recipe deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast('Error', 'Failed to delete recipe', 'error');
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      loading,
      store,
      openCreateRecipe,
      editRecipe,
      deleteRecipe,
      formatDate
    };
  }
}
</script> 