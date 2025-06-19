<template>
  <div class="container mt-4">
    <h1 class="mb-4">Family Recipes</h1>
    <div class="row g-4">
      <div v-for="recipe in familyRecipes" :key="recipe.recipe_id" class="col-12 col-md-6 col-lg-4">
        <FamilyRecipePreview :recipe="recipe" />
      </div>
      <div v-if="familyRecipes.length === 0" class="col-12 text-center">
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          No family recipes found.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import FamilyRecipePreview from '../components/FamilyRecipePreview.vue'

export default {
  name: 'FamilyRecipesPage',
  components: {
    FamilyRecipePreview
  },
  setup() {
    const store = useStore()
    const familyRecipes = ref([])

    const fetchFamilyRecipes = async () => {
      try {
        const response = await store.dispatch('fetchFamilyRecipes')
        familyRecipes.value = response
      } catch (error) {
        console.error('Error fetching family recipes:', error)
      }
    }

    onMounted(() => {
      fetchFamilyRecipes()
    })

    return {
      familyRecipes
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