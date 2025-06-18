<template>
  <div 
    v-if="show"
    class="modal fade show" 
    style="display: block;"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create New Recipe</h5>
          <button 
            type="button" 
            class="btn-close"
            @click="close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRecipe" class="needs-validation" novalidate>
            <!-- Basic Info -->
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input 
                v-model="recipe.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.recipe.title.$error }"
                required
              >
              <div class="invalid-feedback">
                {{ v$.recipe.title.$errors[0]?.$message || 'Title is required' }}
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Preparation Time (minutes)</label>
                <input 
                  v-model.number="recipe.readyInMinutes"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': v$.recipe.readyInMinutes.$error }"
                  required
                >
                <div class="invalid-feedback">
                  {{ v$.recipe.readyInMinutes.$errors[0]?.$message || 'Preparation time is required' }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Servings</label>
                <input 
                  v-model.number="recipe.servings"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': v$.recipe.servings.$error }"
                  required
                >
                <div class="invalid-feedback">
                  {{ v$.recipe.servings.$errors[0]?.$message || 'Number of servings is required' }}
                </div>
              </div>
            </div>

            <!-- Image -->
            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input 
                v-model="recipe.image"
                type="url"
                class="form-control"
                :class="{ 'is-invalid': v$.recipe.image.$error }"
                required
              >
              <div class="invalid-feedback">
                {{ v$.recipe.image.$errors[0]?.$message || 'Image URL is required' }}
              </div>
            </div>

            <!-- Dietary Info -->
            <div class="mb-3">
              <div class="form-check form-check-inline">
                <input 
                  v-model="recipe.vegetarian"
                  type="checkbox"
                  class="form-check-input"
                  id="vegetarian"
                >
                <label class="form-check-label" for="vegetarian">Vegetarian</label>
              </div>
              <div class="form-check form-check-inline">
                <input 
                  v-model="recipe.vegan"
                  type="checkbox"
                  class="form-check-input"
                  id="vegan"
                >
                <label class="form-check-label" for="vegan">Vegan</label>
              </div>
              <div class="form-check form-check-inline">
                <input 
                  v-model="recipe.glutenFree"
                  type="checkbox"
                  class="form-check-input"
                  id="glutenFree"
                >
                <label class="form-check-label" for="glutenFree">Gluten Free</label>
              </div>
            </div>

            <!-- Ingredients -->
            <div class="mb-3">
              <label class="form-label">Ingredients</label>
              <div 
                v-for="(ingredient, index) in recipe.extendedIngredients"
                :key="index"
                class="input-group mb-2"
              >
                <input 
                  v-model="ingredient.amount"
                  type="number"
                  class="form-control"
                  placeholder="Amount"
                  :class="{ 'is-invalid': v$.recipe.extendedIngredients.$each[index].amount.$error }"
                >
                <input 
                  v-model="ingredient.unit"
                  type="text"
                  class="form-control"
                  placeholder="Unit"
                  :class="{ 'is-invalid': v$.recipe.extendedIngredients.$each[index].unit.$error }"
                >
                <input 
                  v-model="ingredient.name"
                  type="text"
                  class="form-control"
                  placeholder="Ingredient name"
                  :class="{ 'is-invalid': v$.recipe.extendedIngredients.$each[index].name.$error }"
                >
                <button 
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeIngredient(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button 
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="addIngredient"
              >
                Add Ingredient
              </button>
            </div>

            <!-- Instructions -->
            <div class="mb-3">
              <label class="form-label">Instructions</label>
              <div 
                v-for="(instruction, index) in recipe.analyzedInstructions[0].steps"
                :key="index"
                class="input-group mb-2"
              >
                <span class="input-group-text">{{ index + 1 }}</span>
                <input 
                  v-model="instruction.step"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.recipe.analyzedInstructions.$each[0].steps.$each[index].step.$error }"
                >
                <button 
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeInstruction(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button 
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="addInstruction"
              >
                Add Step
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button 
            type="button"
            class="btn btn-secondary"
            @click="close"
          >
            Cancel
          </button>
          <button 
            type="button"
            class="btn btn-primary"
            @click="submitRecipe"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Create Recipe
          </button>
        </div>
      </div>
    </div>
  </div>
  <div 
    v-if="show"
    class="modal-backdrop fade show"
  ></div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, url } from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'CreateRecipeModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;

    const loading = ref(false);
    const recipe = ref({
      title: '',
      readyInMinutes: 30,
      servings: 4,
      image: '',
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      extendedIngredients: [],
      analyzedInstructions: [{
        steps: []
      }]
    });

    const rules = {
      recipe: {
        title: { required },
        readyInMinutes: { required, minValue: minValue(1) },
        servings: { required, minValue: minValue(1) },
        image: { required, url },
        extendedIngredients: {
          $each: {
            amount: { required, minValue: minValue(0) },
            unit: { required },
            name: { required }
          }
        },
        analyzedInstructions: {
          $each: {
            steps: {
              $each: {
                step: { required }
              }
            }
          }
        }
      }
    };

    const v$ = useVuelidate(rules, { recipe });

    const addIngredient = () => {
      recipe.value.extendedIngredients.push({
        amount: 1,
        unit: '',
        name: ''
      });
    };

    const removeIngredient = (index) => {
      recipe.value.extendedIngredients.splice(index, 1);
    };

    const addInstruction = () => {
      recipe.value.analyzedInstructions[0].steps.push({
        step: ''
      });
    };

    const removeInstruction = (index) => {
      recipe.value.analyzedInstructions[0].steps.splice(index, 1);
    };

    const close = () => {
      emit('update:show', false);
    };

    const submitRecipe = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) return;

      try {
        loading.value = true;
        await axios.post(`${store.server_domain}/recipes`, recipe.value);
        toast('Success', 'Recipe created successfully', 'success');
        close();
      } catch (error) {
        console.error('Error creating recipe:', error);
        toast('Error', 'Failed to create recipe', 'error');
      } finally {
        loading.value = false;
      }
    };

    return {
      recipe,
      loading,
      v$,
      addIngredient,
      removeIngredient,
      addInstruction,
      removeInstruction,
      close,
      submitRecipe
    };
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style> 