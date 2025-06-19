<template>
  <div class="container">
    <div v-if="recipe">
      <SelfCreatedRecipeView :recipe="recipe" />
    </div>
    <div v-else-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      Recipe not found
    </div>
  </div>
</template>

<script>
import SelfCreatedRecipeView from '../components/SelfCreatedRecipeView.vue'
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'SelfCreatedRecipeViewPage',
  components: {
    SelfCreatedRecipeView
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const recipe = ref(null)
    const loading = ref(true)

    const fetchRecipe = async () => {
      try {
        const recipeId = route.params.recipeId;
        console.log("Fetching self-created recipe details for ID:", recipeId)
        
        // Fetch recipe details
        const recipeResponse = await axios.get(
          `${store.getters.server_domain}/recipes/details/${recipeId}`,
          { withCredentials: true }
        );
        
        if (recipeResponse.status === 200) {
          let recipeData = recipeResponse.data;
          console.log("Recipe data received:", recipeData);
          
          // Try to fetch ingredients separately if extendedIngredients is empty
          if (!recipeData.extendedIngredients || recipeData.extendedIngredients.length === 0) {
            console.log("No ingredients found, trying ingredients endpoint...");
            
            try {
              const ingredientsResponse = await axios.get(
                `${store.getters.server_domain}/user/ingredients/${recipeId}`,
                { withCredentials: true }
              );
              
              console.log("Ingredients response:", ingredientsResponse.data);
              
              if (ingredientsResponse.data && ingredientsResponse.data.length > 0) {
                // Transform ingredients to match expected format
                recipeData.extendedIngredients = ingredientsResponse.data.map(ing => ({
                  name: ing.name,
                  amount: ing.amount,
                  unit: ing.unit,
                  original: `${ing.amount} ${ing.unit} ${ing.name}`
                }));
                console.log("Transformed ingredients:", recipeData.extendedIngredients);
              }
            } catch (ingredientsError) {
              console.log("Could not fetch ingredients separately:", ingredientsError);
            }
          }
          
          recipe.value = {
            ...recipeData,
            isSelfCreated: true
          };
          
          // Add to last watched
          store.dispatch('addToLastWatched', recipe.value)
        } else {
          throw new Error("Recipe not found");
        }
        
      } catch (error) {
        console.error("Error fetching recipe:", error);
        router.replace("/NotFound");
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      fetchRecipe()
    })

    return {
      recipe,
      loading
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style> 