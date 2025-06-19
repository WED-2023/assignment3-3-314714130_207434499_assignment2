<template>
  <div class="recipe-body">
    <div class="recipe-header mt-3 mb-4">
      <h1>{{ recipe.family_member_name }}</h1>
      <img :src="recipe.image || defaultImage" class="center" alt="Family Recipe Image" />
    </div>
    <div class="wrapper">
      <div class="wrapped">
        <div class="mb-3">
          <div class="family-info">
            <div class="mt-2">
              <strong>Made by:</strong> {{ recipe.relation }}
            </div>
            <div class="mt-2">
              <strong>Usually prepared for:</strong> {{ recipe.occasion }}
            </div>
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
export default {
  name: 'FamilyRecipeView',
  props: {
    recipe: {
      type: Object,
      required: true,
      validator: function(value) {
        return value && 
          value.family_member_name !== undefined &&
          value.relation !== undefined &&
          value.occasion !== undefined;
      }
    }
  },
  data() {
    return {
      defaultImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
    }
  },
  computed: {
    ingredients() {
      if (!this.recipe.ingredients) return [];
      if (Array.isArray(this.recipe.ingredients)) {
        return this.recipe.ingredients;
      }
      return this.recipe.ingredients.split(',').map(i => i.trim()).filter(i => i);
    },
    instructions() {
      if (!this.recipe.preparation) return [];
      if (Array.isArray(this.recipe.preparation)) {
        return this.recipe.preparation;
      }
      return this.recipe.preparation.split('.').map(i => i.trim()).filter(i => i);
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

.family-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
</style> 