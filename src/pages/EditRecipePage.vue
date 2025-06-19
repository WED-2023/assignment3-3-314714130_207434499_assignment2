<template>
  <div class="container mt-4">
    <h1 class="mb-4">Edit Recipe</h1>
    <div v-if="recipe" class="card">
      <div class="card-body">
        <form @submit.prevent="saveRecipe">
          <div class="mb-3">
            <label for="title" class="form-label">Recipe Title</label>
            <input 
              type="text" 
              class="form-control" 
              id="title" 
              v-model="recipe.title" 
              required
            >
          </div>

          <div class="mb-3">
            <label for="readyInMinutes" class="form-label">Preparation Time (minutes)</label>
            <input 
              type="number" 
              class="form-control" 
              id="readyInMinutes" 
              v-model="recipe.readyInMinutes"
            >
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Image URL</label>
            <input 
              type="url" 
              class="form-control" 
              id="image" 
              v-model="recipe.image"
            >
          </div>

          <div class="mb-3">
            <label for="ingredients" class="form-label">Ingredients</label>
            <textarea 
              class="form-control" 
              id="ingredients" 
              v-model="recipe.ingredients" 
              rows="5"
              placeholder="Enter each ingredient on a new line"
              required
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="instructions" class="form-label">Instructions</label>
            <textarea 
              class="form-control" 
              id="instructions" 
              v-model="recipe.instructions" 
              rows="5"
              placeholder="Enter each step on a new line"
              required
            ></textarea>
          </div>

          <div class="mb-3">
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="vegan" 
                v-model="recipe.vegan"
              >
              <label class="form-check-label" for="vegan">Vegan</label>
            </div>
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="vegetarian" 
                v-model="recipe.vegetarian"
              >
              <label class="form-check-label" for="vegetarian">Vegetarian</label>
            </div>
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="glutenFree" 
                v-model="recipe.glutenFree"
              >
              <label class="form-check-label" for="glutenFree">Gluten Free</label>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-outline-secondary" @click="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditRecipePage',
  data() {
    return {
      recipe: null
    }
  },
  methods: {
    async saveRecipe() {
      try {
        await this.axios.put(
          `${this.$root.store.server_domain}/users/myRecipes/${this.recipe.id}`,
          this.recipe
        );
        this.$router.push(`/recipe/my/${this.recipe.id}`);
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    },
    cancel() {
      this.$router.push(`/recipe/my/${this.recipe.id}`);
    }
  },
  async created() {
    try {
      const recipeId = this.$route.params.recipeId;
      const response = await this.axios.get(
        `${this.$root.store.server_domain}/users/myRecipes`
      );
      if (response.status === 200) {
        const myRecipe = response.data.find(r => r.id.toString() === recipeId);
        if (myRecipe) {
          this.recipe = { ...myRecipe };
        } else {
          this.$router.replace("/NotFound");
        }
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      this.$router.replace("/NotFound");
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 