<template>
  <div>
    <h3>{{ title }}</h3>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="recipes && recipes.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
      <div class="col" v-for="recipe in recipes" :key="recipe.id">
        <RecipePreview :recipe="recipe" />
      </div>
    </div>
    <div v-else class="text-center py-5">
      <p class="text-muted">No recipes found.</p>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    recipes: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    
    return {
      isLoggedIn: computed(() => store.getters.username),
    };
  }
};
</script>

<style scoped>
.container {
  min-height: 400px;
}

.row {
  margin: 0;
}
</style>
