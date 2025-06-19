<template>
  <div class="card h-100 recipe-preview" @click="navigateToRecipe">
    <img :src="recipe.image" class="card-img-top" :alt="recipe.title">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0">{{ recipe.title }}</h5>
        <div v-if="isLoggedIn" class="favorite-icon" @click.stop="toggleFavorite">
          <i class="bi" :class="recipe.isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
        </div>
      </div>
      
      <p class="card-text">Ready in {{ recipe.readyInMinutes }} minutes</p>
      <div class="mt-auto">
        <div class="dietary-badges mb-2">
          <span v-if="recipe.vegetarian" class="badge bg-info me-1">Vegetarian</span>
          <span v-if="recipe.vegan" class="badge bg-success me-1">Vegan</span>
          <span v-if="recipe.glutenFree" class="badge bg-warning">Gluten Free</span>
        </div>
        <div class="recipe-preview-footer">
          <div class="likes">
            <i class="bi bi-heart-fill"></i>
            <span>{{ recipe.popularity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = computed(() => store.getters.username);

    const navigateToRecipe = () => {
      // Add to last watched when navigating
      store.dispatch('addToLastWatched', props.recipe);
      
      // Determine recipe type and navigate to appropriate route
      if (props.recipe.isFamily || props.recipe.id.toString().startsWith('family_')) {
        router.push({ name: 'familyRecipe', params: { recipeId: props.recipe.id } });
      } else if (props.recipe.isSelfCreated || props.recipe.id.toString().startsWith('self_')) {
        router.push({ name: 'myRecipe', params: { recipeId: props.recipe.id } });
      } else {
        // Default to spoonacular recipe for external/API recipes
        router.push({ name: 'spoonacularRecipe', params: { recipeId: props.recipe.id } });
      }
    };

    const toggleFavorite = async () => {
      try {
        if (props.recipe.isFavorite) {
          await store.dispatch('removeFavorite', props.recipe.id);
        } else {
          await store.dispatch('addFavorite', props.recipe.id);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    };

    return {
      isLoggedIn,
      navigateToRecipe,
      toggleFavorite
    };
  }
};
</script>

<style scoped>
.recipe-preview {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.recipe-preview:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.recipe-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.recipe-preview:hover::before {
  opacity: 1;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.recipe-preview:hover .card-img-top {
  transform: scale(1.05);
}

.card-body {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
}

.card-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.05rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  min-height: 2.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-text {
  color: #6c757d;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.favorite-icon {
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
}

.favorite-icon:hover {
  transform: scale(1.2);
}

.favorite-icon i {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.favorite-icon i.bi-star {
  color: #dee2e6;
}

.favorite-icon i.bi-star-fill {
  color: #ffc107;
  filter: drop-shadow(0 2px 8px rgba(255, 193, 7, 0.3));
}

.recipe-preview-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
}

.dietary-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 8px;
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 15px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge.bg-info {
  background: linear-gradient(135deg, #17a2b8, #138496) !important;
}

.badge.bg-success {
  background: linear-gradient(135deg, #28a745, #218838) !important;
}

.badge.bg-warning {
  background: linear-gradient(135deg, #ffc107, #e0a800) !important;
  color: #212529 !important;
}

.likes {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #dc3545;
  font-weight: 600;
  background: rgba(220, 53, 69, 0.1);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
}

.likes i {
  font-size: 0.9rem;
  filter: drop-shadow(0 1px 3px rgba(220, 53, 69, 0.3));
}
</style>

