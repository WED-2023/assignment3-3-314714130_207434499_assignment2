<template>
  <div class="container">
    <div v-if="recipe">
      <FamilyRecipeView :recipe="recipe" />
    </div>
    <div v-else class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import FamilyRecipeView from '../components/FamilyRecipeView.vue'

export default {
  name: 'FamilyRecipeViewPage',
  components: {
    FamilyRecipeView
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const recipe = ref(null)

    const fetchRecipe = async () => {
      try {
        const recipeId = parseInt(route.params.recipeId)
        if (isNaN(recipeId)) {
          throw new Error('Invalid recipe ID')
        }

        const familyRecipes = await store.dispatch('fetchFamilyRecipes')
        const familyRecipe = familyRecipes.find(r => r.id === recipeId)
        
        if (familyRecipe) {
          recipe.value = {
            id: familyRecipe.id,
            family_member_name: familyRecipe.family_member_name,
            relation: familyRecipe.relation,
            occasion: familyRecipe.occasion,
            ingredients: familyRecipe.ingredients,
            preparation: familyRecipe.preparation,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
          }
        } else {
          router.replace("/404")
        }
      } catch (error) {
        console.error("Error fetching family recipe:", error)
        router.replace("/404")
      }
    }

    onMounted(() => {
      fetchRecipe()
    })

    return {
      recipe
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