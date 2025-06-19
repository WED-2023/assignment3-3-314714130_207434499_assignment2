<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="createRecipe">
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
              required
            >
          </div>

          <div class="mb-3">
            <label for="servings" class="form-label">Number of Servings</label>
            <input 
              type="number" 
              class="form-control" 
              id="servings" 
              v-model="recipe.servings"
              min="1"
              required
            >
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Image URL</label>
            <input 
              type="url" 
              class="form-control" 
              id="image" 
              v-model="recipe.image"
              placeholder="https://example.com/image.jpg"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Ingredients</label>
            <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-row mb-2">
              <div class="row g-2">
                <div class="col-5">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="ingredient.name" 
                    placeholder="Ingredient name"
                    required
                  >
                </div>
                <div class="col-2">
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="ingredient.amount" 
                    placeholder="Amount"
                    min="0"
                    step="0.1"
                    required
                  >
                </div>
                <div class="col-3">
                  <select class="form-select" v-model="ingredient.unit" required>
                    <option value="">Select unit</option>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="l">Liters (l)</option>
                    <option value="tsp">Teaspoons (tsp)</option>
                    <option value="tbsp">Tablespoons (tbsp)</option>
                    <option value="cup">Cups</option>
                    <option value="piece">Pieces</option>
                    <option value="to taste">To taste</option>
                  </select>
                </div>
                <div class="col-2">
                  <button 
                    type="button" 
                    class="btn btn-danger" 
                    @click="removeIngredient(index)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <button 
              type="button" 
              class="btn btn-secondary mt-2" 
              @click="addIngredient"
            >
              Add Ingredient
            </button>
          </div>

          <div class="mb-3">
            <label class="form-label">Instructions</label>
            <div v-for="(step, index) in recipe.instructions" :key="index" class="instruction-step mb-2">
              <div class="row g-2 align-items-center">
                <div class="col-1 text-center">
                  <span class="step-number">{{ index + 1 }}</span>
                </div>
                <div class="col-9">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="step.text"
                    :placeholder="`Step ${index + 1}`"
                    required
                  >
                </div>
                <div class="col-2">
                  <button 
                    type="button" 
                    class="btn btn-danger" 
                    @click="removeStep(index)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <button 
              type="button" 
              class="btn btn-secondary mt-2" 
              @click="addStep"
            >
              Add Step
            </button>
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
            <button type="submit" class="btn btn-primary">Create Recipe</button>
            <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'NewRecipePage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isSubmitting = ref(false)

    const recipe = ref({
      title: '',
      readyInMinutes: null,
      image: '',
      ingredients: [{ name: '', amount: '', unit: '' }],
      instructions: [{ text: '' }],
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      servings: null,
      popularity: 0
    })

    const addIngredient = () => {
      recipe.value.ingredients.push({ name: '', amount: '', unit: '' })
    }

    const removeIngredient = (index) => {
      recipe.value.ingredients.splice(index, 1)
      // Ensure there's always at least one ingredient
      if (recipe.value.ingredients.length === 0) {
        addIngredient()
      }
    }

    const addStep = () => {
      recipe.value.instructions.push({ text: '' })
    }

    const removeStep = (index) => {
      recipe.value.instructions.splice(index, 1)
      // Ensure there's always at least one step
      if (recipe.value.instructions.length === 0) {
        addStep()
      }
    }

    const createRecipe = async () => {
      try {
        isSubmitting.value = true
        
        // Format recipe data for API
        const formattedRecipe = {
          title: recipe.value.title,
          readyInMinutes: parseInt(recipe.value.readyInMinutes),
          image: recipe.value.image,
          ingredients: recipe.value.ingredients.map(ing => ({
            name: ing.name,
            amount: parseFloat(ing.amount),
            unit: ing.unit
          })),
          instructions: recipe.value.instructions.map(step => step.text).join('\n'),
          vegan: recipe.value.vegan,
          vegetarian: recipe.value.vegetarian,
          glutenFree: recipe.value.glutenFree,
          servings: parseInt(recipe.value.servings),
          popularity: recipe.value.popularity
        }

        await store.dispatch('createRecipe', formattedRecipe)
        router.push('/my-recipes')
      } catch (error) {
        console.error('Error creating recipe:', error)
        alert('Failed to create recipe. Please check all fields are filled correctly.')
      } finally {
        isSubmitting.value = false
      }
    }

    const cancel = () => {
      router.push('/my-recipes')
    }

    return {
      recipe,
      isSubmitting,
      createRecipe,
      cancel,
      addIngredient,
      removeIngredient,
      addStep,
      removeStep
    }
  }
}
</script>

<style scoped>
.card {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.ingredient-row, .instruction-step {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.ingredient-row:hover, .instruction-step:hover {
  background-color: #e9ecef;
}

.step-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}
</style> 