<template>
  <div class="recipe-preview card h-100" @mouseover="showHint = true" @mouseleave="showHint = false">
    <div class="position-relative">
      <img 
        :src="recipe.image" 
        class="card-img-top recipe-image" 
        :alt="recipe.title"
        @click="navigateToRecipe"
      >
      <button 
        v-if="isLoggedIn"
        class="btn btn-sm position-absolute top-0 end-0 m-2"
        :class="isFavorite ? 'btn-danger' : 'btn-outline-danger'"
        @click.stop="toggleFavorite"
      >
        <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
      </button>
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-muted">
          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} min
        </span>
        <span class="text-muted">
          <i class="bi bi-heart"></i> {{ recipe.aggregateLikes || 0 }}
        </span>
      </div>
      
      <div class="d-flex flex-wrap gap-1 mb-2">
        <span v-if="recipe.vegan" class="badge bg-success">Vegan</span>
        <span v-if="recipe.vegetarian" class="badge bg-info">Vegetarian</span>
        <span v-if="recipe.glutenFree" class="badge bg-warning">Gluten-Free</span>
      </div>

      <div v-if="isLoggedIn" class="text-muted small">
        <span v-if="recipe.viewed" class="me-2">
          <i class="bi bi-eye"></i> Viewed
        </span>
        <span v-if="recipe.saved">
          <i class="bi bi-bookmark"></i> Saved
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SpoonacularRecipePreview',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const showHint = ref(false)

    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const isFavorite = computed(() => store.getters.isRecipeFavorite(props.recipe.id))

    const navigateToRecipe = () => {
      if (!props.recipe.id && props.recipe.id !== 0) {
        console.error("Invalid recipe ID:", props.recipe);
        return;
      }
      
      const recipeId = props.recipe.id.toString();
      console.log("Recipe data:", props.recipe);
      console.log("Navigating to Spoonacular recipe with ID:", recipeId);
      store.dispatch('addToLastWatched', props.recipe);
      router.push({
        name: 'spoonacularRecipe',
        params: { recipeId }
      });
    }

    const toggleFavorite = async () => {
      if (!isLoggedIn.value) {
        router.push('/login')
        return
      }
      
      try {
        if (isFavorite.value) {
          await store.dispatch('removeFromFavorites', props.recipe.id)
        } else {
          await store.dispatch('addToFavorites', props.recipe)
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
      }
    }

    return {
      showHint,
      isLoggedIn,
      isFavorite,
      navigateToRecipe,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.recipe-preview {
  transition: transform 0.2s;
}

.recipe-preview:hover {
  transform: translateY(-5px);
}

.recipe-image {
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  height: 2.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> 