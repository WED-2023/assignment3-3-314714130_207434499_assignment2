<template>
  <div class="container">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else-if="recipe">
      <SpoonacularRecipeView :recipe="recipe" />
    </div>
  </div>
</template>

<script>
import SpoonacularRecipeView from '../components/SpoonacularRecipeView.vue'
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SpoonacularRecipeViewPage',
  components: {
    SpoonacularRecipeView
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const recipe = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchRecipe = async () => {
      try {
        const recipeId = route.params.recipeId
        console.log("Fetching Spoonacular recipe details for ID:", recipeId)
        loading.value = true
        error.value = null
        
        const endpoint = `${store.getters.server_domain}/recipes/details/${recipeId}`
        console.log("Calling endpoint:", endpoint)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Recipe data received:", data)
        recipe.value = data
        
        // Add to last watched
        store.dispatch('addToLastWatched', recipe.value)
      } catch (error) {
        console.error("Error fetching recipe details:", error)
        error.value = "Failed to load recipe. Please try again later."
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchRecipe()
    })

    return {
      recipe,
      loading,
      error
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