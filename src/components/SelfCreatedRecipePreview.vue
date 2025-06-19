<template>
  <div class="recipe-preview card h-100" @click="navigateToRecipe">
    <div class="position-relative">
      <img 
        :src="recipe.image || defaultImage" 
        class="card-img-top recipe-image" 
        :alt="recipe.title"
      >
      <div class="self-created-badge">
        <i class="bi bi-pencil-fill"></i> My Recipe
      </div>
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-muted" v-if="recipe.readyInMinutes">
          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} min
        </span>
        <span class="text-muted">
          <i class="bi bi-heart"></i> {{ recipe.popularity || 0 }}
        </span>
      </div>
      
      <div class="d-flex flex-wrap gap-1 mb-2">
        <span v-if="recipe.vegan" class="badge bg-success">Vegan</span>
        <span v-if="recipe.vegetarian" class="badge bg-info">Vegetarian</span>
        <span v-if="recipe.glutenFree" class="badge bg-warning">Gluten-Free</span>
      </div>


    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'SelfCreatedRecipePreview',
  props: {
    recipe: {
      type: Object,
      required: true,
      validator: function(value) {
        return value && value.id !== undefined && value.title !== undefined;
      }
    }
  },

  setup(props) {
    const router = useRouter()
    const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'

    const navigateToRecipe = () => {
      if (!props.recipe.id) {
        console.error("Invalid recipe ID:", props.recipe);
        return;
      }
      
      router.push(`/recipe/my/${props.recipe.id}`);
    }



    return {
      navigateToRecipe,
      defaultImage
    }
  }
}
</script>

<style scoped>
.recipe-preview {
  transition: transform 0.2s;
  cursor: pointer;
}

.recipe-preview:hover {
  transform: translateY(-5px);
}

.recipe-image {
  height: 200px;
  object-fit: cover;
}

.self-created-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(13, 110, 253, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
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