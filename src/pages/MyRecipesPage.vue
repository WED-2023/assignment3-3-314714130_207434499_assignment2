<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>My Recipes</h1>
      <router-link to="/recipe/new" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> Create New Recipe
      </router-link>
    </div>
    
    <div class="row g-4">
      <div v-if="loading" class="col-12 text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <template v-else>
        <div v-for="recipe in myRecipes" :key="recipe.id" class="col-12 col-md-6 col-lg-4">
          <SelfCreatedRecipePreview 
            :recipe="recipe" 
          />
        </div>
        <div v-if="myRecipes.length === 0" class="col-12 text-center">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            You haven't created any recipes yet.
            <router-link to="/recipe/new" class="alert-link">Create your first recipe!</router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import SelfCreatedRecipePreview from '../components/SelfCreatedRecipePreview.vue'

export default {
  name: 'MyRecipesPage',
  components: {
    SelfCreatedRecipePreview
  },
  setup() {
    const store = useStore()
    const myRecipes = ref([])
    const loading = ref(true)

    const fetchMyRecipes = async () => {
      try {
        loading.value = true
        const recipes = await store.dispatch('fetchMyRecipes')
        myRecipes.value = recipes
      } catch (error) {
        console.error('Error fetching my recipes:', error)
      } finally {
        loading.value = false
      }
    }



    onMounted(() => {
      fetchMyRecipes()
    })

    return {
      myRecipes,
      loading
    }
  }
}
</script>

<style scoped>
h1 {
  color: #2c3e50;
  font-weight: 600;
}
</style> 