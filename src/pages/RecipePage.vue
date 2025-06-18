<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="recipe" class="recipe-page">
      <!-- Recipe header -->
      <div class="row mb-4">
        <div class="col-md-8">
          <h1 class="mb-3">{{ recipe.title }}</h1>
          <div class="d-flex gap-3 mb-3">
            <span><i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} min</span>
            <span><i class="bi bi-heart"></i> {{ recipe.popularity }} likes</span>
            <span><i class="bi bi-people"></i> {{ recipe.servings }} servings</span>
          </div>
          <div class="d-flex gap-2 mb-3">
            <span v-if="recipe.vegan" class="badge bg-success">Vegan</span>
            <span v-if="recipe.vegetarian" class="badge bg-success">Vegetarian</span>
            <span v-if="recipe.glutenFree" class="badge bg-info">Gluten Free</span>
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button 
            class="btn btn-success me-2"
            @click="startCooking"
          >
            <i class="bi bi-play-circle"></i> Start Cooking
          </button>
          <button 
            class="btn btn-primary"
            @click="addToMealPlan"
          >
            <i class="bi bi-calendar-plus"></i> Add to Meal Plan
          </button>
        </div>
      </div>

      <!-- Recipe image -->
      <div class="row mb-4">
        <div class="col-12">
          <img 
            :src="recipe.image" 
            :alt="recipe.title"
            class="img-fluid rounded"
            style="max-height: 400px; width: 100%; object-fit: cover;"
          >
        </div>
      </div>

      <!-- Recipe content -->
      <div class="row">
        <!-- Ingredients -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Ingredients</h3>
              <ul class="list-group list-group-flush">
                <li 
                  v-for="ingredient in recipe.extendedIngredients" 
                  :key="ingredient.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
                  </span>
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    @click="toggleIngredient(ingredient.id)"
                  >
                    <i class="bi" :class="isIngredientChecked(ingredient.id) ? 'bi-check-square' : 'bi-square'"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Instructions</h3>
              <div v-if="recipe.analyzedInstructions && recipe.analyzedInstructions[0]">
                <div 
                  v-for="step in recipe.analyzedInstructions[0].steps" 
                  :key="step.number"
                  class="mb-4"
                >
                  <div class="d-flex">
                    <div class="step-number me-3">{{ step.number }}</div>
                    <div class="step-content">
                      <p>{{ step.step }}</p>
                      <div v-if="step.equipment.length > 0" class="mt-2">
                        <small class="text-muted">
                          Equipment: {{ step.equipment.map(e => e.name).join(', ') }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted">
                No instructions available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h3>Recipe not found</h3>
      <p class="text-muted">The recipe you're looking for doesn't exist or has been removed.</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'RecipePage',
  setup() {
    const route = useRoute();
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    const recipe = ref(null);
    const loading = ref(true);
    const checkedIngredients = ref(new Set());

    const fetchRecipe = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`${store.getters.server_domain}/recipes/details/${route.params.recipeId}`);
        recipe.value = response.data;
        store.dispatch('addToLastWatched', recipe.value);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast('Error', 'Failed to load recipe', 'error');
      } finally {
        loading.value = false;
      }
    };

    const toggleIngredient = (ingredientId) => {
      if (checkedIngredients.value.has(ingredientId)) {
        checkedIngredients.value.delete(ingredientId);
      } else {
        checkedIngredients.value.add(ingredientId);
      }
    };

    const isIngredientChecked = (ingredientId) => {
      return checkedIngredients.value.has(ingredientId);
    };

    const startCooking = () => {
      // TODO: Implement cooking mode
      toast('Coming Soon', 'Cooking mode will be available soon!', 'info');
    };

    const addToMealPlan = () => {
      // TODO: Implement meal planning
      toast('Coming Soon', 'Meal planning will be available soon!', 'info');
    };

    onMounted(fetchRecipe);

    return {
      recipe,
      loading,
      checkedIngredients,
      toggleIngredient,
      isIngredientChecked,
      startCooking,
      addToMealPlan
    };
  }
}
</script>

<style scoped>
.step-number {
  width: 30px;
  height: 30px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-content {
  flex: 1;
}
</style> 