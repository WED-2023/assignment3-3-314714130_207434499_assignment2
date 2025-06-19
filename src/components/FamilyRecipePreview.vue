<template>
  <div class="recipe-preview card h-100" @click="navigateToRecipe">
    <div class="position-relative">
      <img 
        :src="getDishImage(recipe.family_member_name)" 
        class="card-img-top recipe-image" 
        :alt="recipe.family_member_name"
      >
      <div class="family-badge">
        <i class="bi bi-people-fill"></i> Family Recipe
      </div>
    </div>
    
    <div class="card-body">
      <h5 class="card-title">{{ recipe.family_member_name }}</h5>
      <div class="family-info mb-2">
        <div><strong>Made by:</strong> {{ recipe.relation }}</div>
        <div><strong>Occasion:</strong> {{ recipe.occasion }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'FamilyRecipePreview',
  props: {
    recipe: {
      type: Object,
      required: true,
      validator: function(value) {
        return value && value.id !== undefined;
      }
    }
  },
  setup(props) {
    const router = useRouter()

    // Function to get appropriate image based on dish name
    const getDishImage = (dishName) => {
      if (!dishName) return getDefaultImage();
      
      const name = dishName.toLowerCase();
      
      // Use reliable Unsplash images for specific dishes
      if (name === 'apple pie') {
        return 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?auto=format&fit=crop&w=400&q=80';
      }
      
      if (name === 'lasagna') {
        return 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&q=80';
      }
      
      // Keep the current breakfast image
      if (name === 'breakfast') {
        return 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80';
      }
      
      // Return default food image if no match found
      return getDefaultImage();
    };

    const getDefaultImage = () => {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';
    };

    const navigateToRecipe = () => {
      const recipeId = props.recipe.id;
      if (!recipeId) {
        console.error("Invalid recipe ID:", props.recipe);
        return;
      }
      
      router.push({
        name: 'familyRecipe',
        params: { recipeId: recipeId.toString() }
      });
    }

    return {
      navigateToRecipe,
      getDishImage
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
  filter: brightness(0.9);
}

.family-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.card-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.family-info {
  font-size: 0.9rem;
  color: #666;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
}
</style> 