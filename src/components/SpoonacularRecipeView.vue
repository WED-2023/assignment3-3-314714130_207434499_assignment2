<template>
  <div class="recipe-body">
    <div class="recipe-header mt-3 mb-4">
      <div class="d-flex justify-content-between align-items-start">
        <h1>{{ recipe.title }}</h1>
        <button 
          v-if="isLoggedIn"
          class="btn btn-lg"
          :class="isFavorite ? 'btn-warning' : 'btn-outline-warning'"
          @click="toggleFavorite"
        >
          <i class="bi" :class="isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
        </button>
      </div>
      <img :src="recipe.image" class="center" alt="Recipe Image" />
    </div>
    <div class="wrapper">
      <div class="wrapped">
        <div class="mb-3">
          <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
          <div>Likes: {{ recipe.popularity || 0 }} likes</div>
          <div class="mt-2">
            <span v-if="recipe.vegan" class="badge bg-success me-2">Vegan</span>
            <span v-if="recipe.vegetarian" class="badge bg-info me-2">Vegetarian</span>
            <span v-if="recipe.glutenFree" class="badge bg-warning">Gluten-Free</span>
          </div>
        </div>
        <div class="mt-3">
          <h3>Ingredients:</h3>
          <ul class="list-group list-group-flush">
            <li
              v-for="ingredient in ingredients"
              :key="ingredient"
              class="list-group-item"
            >
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapped">
        <h3>Instructions:</h3>
        <ol class="list-group list-group-flush">
          <li 
            v-for="(step, index) in instructions" 
            :key="index"
            class="list-group-item"
          >
            {{ step }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SpoonacularRecipeView',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const isLoggedIn = computed(() => store.getters.username)
    const isFavorite = computed(() => store.getters.isFavorite(props.recipe.id))

    const toggleFavorite = async () => {
      if (!isLoggedIn.value) {
        return
      }
      
      try {
        await store.dispatch('toggleFavorite', props.recipe)
      } catch (error) {
        console.error('Error toggling favorite:', error)
      }
    }

    return {
      isLoggedIn,
      isFavorite,
      toggleFavorite,
      ingredients: computed(() => {
        if (!props.recipe.extendedIngredients) return [];
        return props.recipe.extendedIngredients.map(i => i.original);
      }),
      instructions: computed(() => {
        if (!props.recipe) return [];
        
        if (props.recipe.analyzedInstructions && props.recipe.analyzedInstructions.length > 0) {
          return props.recipe.analyzedInstructions[0].steps.map(s => s.step);
        }
        
        if (props.recipe.instructions) {
          return props.recipe.instructions.split('\n').map(i => i.trim()).filter(i => i);
        }

        return [];
      })
    }
  }
}
</script>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  height: auto;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.wrapped {
  flex: 1;
  min-width: 300px;
}

.btn-warning, .btn-outline-warning {
  color: #ffc107; /* Bootstrap warning color */
}
.btn-warning:hover, .btn-outline-warning:hover {
  color: #fff;
}
</style> 