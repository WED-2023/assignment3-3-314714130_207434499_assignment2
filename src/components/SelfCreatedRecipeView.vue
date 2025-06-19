<template>
  <div class="recipe-body">
    <div class="recipe-header mt-3 mb-4">
      <h1>{{ recipe.title }}</h1>
      <img :src="recipe.image" class="center" alt="Recipe Image" />
    </div>
    
    <div class="wrapper">
      <div class="wrapped">
        <div class="mb-3">
          <div v-if="recipe.readyInMinutes">Ready in {{ recipe.readyInMinutes }} minutes</div>
          <div>Servings: {{ recipe.servings }}</div>
          <div class="mt-2">
            <span v-if="recipe.vegan" class="badge bg-success me-2">Vegan</span>
            <span v-if="recipe.vegetarian" class="badge bg-info me-2">Vegetarian</span>
            <span v-if="recipe.glutenFree" class="badge bg-warning">Gluten-Free</span>
          </div>
        </div>
        <div class="mt-3">
          <h3>Ingredients:</h3>
          <div v-if="ingredientsList.length === 0" class="alert alert-warning">
            No ingredients found for this recipe.
          </div>
          <ul v-else class="list-group list-group-flush">
            <li
              v-for="ingredient in ingredientsList"
              :key="ingredient.name || ingredient.original || ingredient"
              class="list-group-item"
            >
              {{ formatIngredient(ingredient) }}
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapped">
        <h3>Instructions:</h3>
        <ol class="list-group list-group-flush">
          <li 
            v-for="(step, index) in instructionSteps" 
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
export default {
  name: 'SelfCreatedRecipeView',
  props: {
    recipe: {
      type: Object,
      required: true,
      validator: function(value) {
        return value && 
               typeof value.title === 'string' && 
               (Array.isArray(value.ingredients) || Array.isArray(value.extendedIngredients) || !value.ingredients) &&
               typeof value.instructions === 'string';
      }
    }
  },
  computed: {
    ingredientsList() {
      // Handle both 'ingredients' and 'extendedIngredients' properties
      return this.recipe.extendedIngredients || this.recipe.ingredients || [];
    },
    instructionSteps() {
      return this.recipe.instructions.split('\n').filter(step => step.trim());
    }
  },
  methods: {
    formatIngredient(ingredient) {
      // Handle different ingredient formats
      if (ingredient.amount && ingredient.unit && ingredient.name) {
        // Format: amount unit name (for self-created recipes)
        return `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
      } else if (ingredient.original) {
        // Format: original text (for Spoonacular recipes)
        return ingredient.original;
      } else if (typeof ingredient === 'string') {
        // Format: plain string
        return ingredient;
      } else {
        // Fallback: try to display whatever we have
        return ingredient.name || ingredient.originalString || 'Unknown ingredient';
      }
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

.list-group-item {
  background: transparent;
  border-left: none;
  border-right: none;
}

img {
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
}

h3 {
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style> 