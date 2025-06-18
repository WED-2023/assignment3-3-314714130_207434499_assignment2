<template>
  <div class="container py-4">
    <h2 class="mb-4">My Favorites</h2>

    <div v-if="!store.username" class="text-center py-5">
      <h3>Please log in to view your favorites</h3>
      <p class="text-muted mb-4">Sign in to see your saved recipes</p>
      <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
      <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
    </div>

    <div v-else>
      <div v-if="store.favorites.length > 0" class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="recipe in store.favorites" :key="recipe.id" class="col">
          <RecipePreview :recipe="recipe" />
        </div>
      </div>
      <div v-else class="text-center py-5">
        <h3>No favorites yet</h3>
        <p class="text-muted mb-4">Start exploring recipes and add them to your favorites!</p>
        <router-link to="/" class="btn btn-primary">Browse Recipes</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreview from '@/components/RecipePreview.vue';

export default {
  name: 'FavoritesPage',
  components: {
    RecipePreview
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
}
</script> 