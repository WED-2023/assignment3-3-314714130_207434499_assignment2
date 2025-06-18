<template>
  <div class="container py-4">
    <h2 class="mb-4">Family Recipes</h2>

    <div v-if="!store.username" class="text-center py-5">
      <h3>Please log in to view family recipes</h3>
      <p class="text-muted mb-4">Sign in to see your family's special recipes</p>
      <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
      <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
    </div>

    <div v-else>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="recipes.length > 0" class="row row-cols-1 row-cols-md-2 g-4">
        <div v-for="recipe in recipes" :key="recipe.id" class="col">
          <div class="card h-100">
            <div class="row g-0">
              <div class="col-md-4">
                <img 
                  :src="recipe.image" 
                  class="img-fluid rounded-start h-100" 
                  :alt="recipe.title"
                  style="object-fit: cover;"
                >
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{{ recipe.title }}</h5>
                  <p class="card-text">
                    <small class="text-muted">
                      <i class="bi bi-person"></i> Made by: {{ recipe.owner }}
                    </small>
                  </p>
                  <p class="card-text">
                    <small class="text-muted">
                      <i class="bi bi-calendar"></i> Usually prepared: {{ recipe.occasion }}
                    </small>
                  </p>
                  <button 
                    class="btn btn-outline-primary btn-sm"
                    @click="showRecipeDetails(recipe)"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h3>No family recipes yet</h3>
        <p class="text-muted mb-4">Add your family's special recipes to share with others!</p>
        <button 
          class="btn btn-primary"
          @click="openCreateRecipe"
        >
          Add Family Recipe
        </button>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div 
      v-if="selectedRecipe"
      class="modal fade show" 
      style="display: block;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedRecipe.title }}</h5>
            <button 
              type="button" 
              class="btn-close"
              @click="selectedRecipe = null"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <img 
                  :src="selectedRecipe.image" 
                  class="img-fluid rounded mb-3" 
                  :alt="selectedRecipe.title"
                >
                <p>
                  <strong>Made by:</strong> {{ selectedRecipe.owner }}
                </p>
                <p>
                  <strong>Usually prepared:</strong> {{ selectedRecipe.occasion }}
                </p>
              </div>
              <div class="col-md-6">
                <h6>Ingredients:</h6>
                <ul class="list-group list-group-flush mb-3">
                  <li 
                    v-for="(ingredient, index) in selectedRecipe.ingredients" 
                    :key="index"
                    class="list-group-item"
                  >
                    {{ ingredient }}
                  </li>
                </ul>
                <h6>Instructions:</h6>
                <ol class="list-group list-group-flush">
                  <li 
                    v-for="(instruction, index) in selectedRecipe.instructions" 
                    :key="index"
                    class="list-group-item"
                  >
                    {{ instruction }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="selectedRecipe"
      class="modal-backdrop fade show"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';

export default {
  name: 'FamilyRecipesPage',
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    const recipes = ref([]);
    const loading = ref(true);
    const selectedRecipe = ref(null);

    const fetchRecipes = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`${store.server_domain}/recipes/family`);
        recipes.value = response.data;
      } catch (error) {
        console.error('Error fetching family recipes:', error);
        toast('Error', 'Failed to load family recipes', 'error');
      } finally {
        loading.value = false;
      }
    };

    const showRecipeDetails = (recipe) => {
      selectedRecipe.value = recipe;
    };

    const openCreateRecipe = () => {
      // TODO: Implement family recipe creation
      toast('Coming Soon', 'Family recipe creation will be available soon!', 'info');
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      loading,
      store,
      selectedRecipe,
      showRecipeDetails,
      openCreateRecipe
    };
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style> 