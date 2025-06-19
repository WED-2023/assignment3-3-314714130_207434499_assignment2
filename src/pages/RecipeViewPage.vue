<template>
  <div class="container">
    <div v-if="recipe">
      <SpoonacularRecipeView 
        v-if="isSpoonacularRecipe" 
        :recipe="recipe" 
      />
      <SelfCreatedRecipeView 
        v-else-if="isSelfCreatedRecipe" 
        :recipe="recipe" 
      />
      <FamilyRecipeView 
        v-else-if="isFamilyRecipe" 
        :recipe="recipe" 
      />
    </div>
  </div>
</template>

<script>
import SpoonacularRecipeView from '../components/SpoonacularRecipeView.vue'
import SelfCreatedRecipeView from '../components/SelfCreatedRecipeView.vue'
import FamilyRecipeView from '../components/FamilyRecipeView.vue'

export default {
  name: 'RecipeViewPage',
  components: {
    SpoonacularRecipeView,
    SelfCreatedRecipeView,
    FamilyRecipeView
  },
  data() {
    return {
      recipe: null,
      recipeType: null // 'spoonacular', 'self', or 'family'
    }
  },
  computed: {
    isSpoonacularRecipe() {
      return this.recipeType === 'spoonacular';
    },
    isSelfCreatedRecipe() {
      return this.recipeType === 'self';
    },
    isFamilyRecipe() {
      return this.recipeType === 'family';
    }
  },
  methods: {
    async fetchFamilyRecipe(recipeId) {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/users/familyRecipes`
      );
      if (response.status === 200) {
        const familyRecipes = response.data;
        const actualId = recipeId.replace('family_', '');
        const familyRecipe = familyRecipes.find(r => r.recipe_id.toString() === actualId);
        
        if (familyRecipe) {
          this.recipe = {
            ...familyRecipe,
            id: recipeId,
            isFamily: true,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
          };
          this.recipeType = 'family';
          return true;
        }
      }
      return false;
    },
    
    async fetchSelfCreatedRecipe(recipeId) {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/users/myRecipes`
      );
      if (response.status === 200) {
        const myRecipe = response.data.find(r => r.id.toString() === recipeId);
        if (myRecipe) {
          this.recipe = {
            ...myRecipe,
            isSelfCreated: true
          };
          this.recipeType = 'self';
          return true;
        }
      }
      return false;
    },
    
    async fetchSpoonacularRecipe(recipeId) {
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/recipes/details/${recipeId}`
      );
      if (response.status === 200) {
        this.recipe = response.data;
        this.recipeType = 'spoonacular';
        return true;
      }
      return false;
    }
  },
  async created() {
    try {
      const recipeId = this.$route.params.recipeId;

      // If it's a family recipe ID, only try family recipe fetch
      if (recipeId.startsWith('family_')) {
        const found = await this.fetchFamilyRecipe(recipeId);
        if (!found) {
          this.$router.replace("/NotFound");
        }
        return;
      }

      // For non-family recipes, first check self-created recipes
      try {
        const found = await this.fetchSelfCreatedRecipe(recipeId);
        if (found) return;
      } catch (error) {
        console.error("Error checking self-created recipes:", error);
      }

      // If not found in self-created, try Spoonacular
      try {
        const found = await this.fetchSpoonacularRecipe(recipeId);
        if (!found) {
          this.$router.replace("/NotFound");
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        this.$router.replace("/NotFound");
      }
    } catch (error) {
      console.error(error);
      this.$router.replace("/NotFound");
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
  