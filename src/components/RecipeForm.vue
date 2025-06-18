<template>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-8">
          <!-- Basic Info -->
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.title.$error }"
              id="title"
              v-model="form.title"
              @blur="v$.title.$touch()"
            >
            <div class="invalid-feedback" v-if="v$.title.$error">
              {{ v$.title.$errors[0].$message }}
            </div>
          </div>
  
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="readyInMinutes" class="form-label">Prep Time (minutes)</label>
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': v$.readyInMinutes.$error }"
                id="readyInMinutes"
                v-model.number="form.readyInMinutes"
                @blur="v$.readyInMinutes.$touch()"
              >
              <div class="invalid-feedback" v-if="v$.readyInMinutes.$error">
                {{ v$.readyInMinutes.$errors[0].$message }}
              </div>
            </div>
  
            <div class="col-md-6">
              <label for="servings" class="form-label">Servings</label>
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': v$.servings.$error }"
                id="servings"
                v-model.number="form.servings"
                @blur="v$.servings.$touch()"
              >
              <div class="invalid-feedback" v-if="v$.servings.$error">
                {{ v$.servings.$errors[0].$message }}
              </div>
            </div>
          </div>
  
          <div class="mb-3">
            <label for="image" class="form-label">Image URL</label>
            <input
              type="url"
              class="form-control"
              :class="{ 'is-invalid': v$.image.$error }"
              id="image"
              v-model="form.image"
              @blur="v$.image.$touch()"
            >
            <div class="invalid-feedback" v-if="v$.image.$error">
              {{ v$.image.$errors[0].$message }}
            </div>
          </div>
  
          <!-- Dietary Info -->
          <div class="mb-3">
            <div class="form-check form-check-inline">
              <input
                type="checkbox"
                class="form-check-input"
                id="vegetarian"
                v-model="form.vegetarian"
              >
              <label class="form-check-label" for="vegetarian">Vegetarian</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                type="checkbox"
                class="form-check-input"
                id="vegan"
                v-model="form.vegan"
              >
              <label class="form-check-label" for="vegan">Vegan</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                type="checkbox"
                class="form-check-input"
                id="glutenFree"
                v-model="form.glutenFree"
              >
              <label class="form-check-label" for="glutenFree">Gluten Free</label>
            </div>
          </div>
        </div>
  
        <div class="col-md-4">
          <!-- Image Preview -->
          <div class="image-preview mb-3">
            <img 
              v-if="form.image" 
              :src="form.image" 
              alt="Recipe preview"
              class="img-fluid rounded"
            >
            <div v-else class="no-image">
              <i class="bi bi-image"></i>
              <p>No image selected</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Ingredients -->
      <div class="mb-4">
        <h4>Ingredients</h4>
        <div 
          v-for="(ingredient, index) in form.extendedIngredients" 
          :key="index"
          class="row mb-2"
        >
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              v-model="ingredient.name"
              placeholder="Ingredient name"
            >
          </div>
          <div class="col-md-3">
            <input
              type="number"
              class="form-control"
              v-model.number="ingredient.amount"
              placeholder="Amount"
              step="0.1"
            >
          </div>
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              v-model="ingredient.unit"
              placeholder="Unit"
            >
          </div>
          <div class="col-md-2">
            <button 
              type="button" 
              class="btn btn-outline-danger"
              @click="removeIngredient(index)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <button 
          type="button" 
          class="btn btn-outline-primary"
          @click="addIngredient"
        >
          <i class="bi bi-plus"></i> Add Ingredient
        </button>
      </div>
  
      <!-- Instructions -->
      <div class="mb-4">
        <h4>Instructions</h4>
        <div 
          v-for="(step, index) in form.analyzedInstructions[0].steps" 
          :key="index"
          class="mb-3"
        >
          <div class="input-group">
            <span class="input-group-text">{{ index + 1 }}</span>
            <input
              type="text"
              class="form-control"
              v-model="step.step"
              :placeholder="`Step ${index + 1}`"
            >
            <button 
              type="button" 
              class="btn btn-outline-danger"
              @click="removeStep(index)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <button 
          type="button" 
          class="btn btn-outline-primary"
          @click="addStep"
        >
          <i class="bi bi-plus"></i> Add Step
        </button>
      </div>
  
      <!-- Form Actions -->
      <div class="d-flex justify-content-end gap-2">
        <button 
          type="button" 
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Recipe' }}
        </button>
      </div>
    </form>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { required, minValue, url } from '@vuelidate/validators'
  
  export default {
    name: 'RecipeForm',
    props: {
      initialData: {
        type: Object,
        default: () => ({
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
        })
      }
    },
    emits: ['submit', 'cancel'],
    setup(props, { emit }) {
      const loading = ref(false)
  
      const form = reactive({
        ...props.initialData,
        extendedIngredients: props.initialData.extendedIngredients.length 
          ? [...props.initialData.extendedIngredients]
          : [{ name: '', amount: 0, unit: '' }],
        analyzedInstructions: [{
          steps: props.initialData.analyzedInstructions[0]?.steps.length
            ? [...props.initialData.analyzedInstructions[0].steps]
            : [{ step: '' }]
        }]
      })
  
      const rules = {
        title: { required },
        readyInMinutes: { required, minValue: minValue(1) },
        servings: { required, minValue: minValue(1) },
        image: { url }
      }
  
      const v$ = useVuelidate(rules, form)
  
      const addIngredient = () => {
        form.extendedIngredients.push({ name: '', amount: 0, unit: '' })
      }
  
      const removeIngredient = (index) => {
        form.extendedIngredients.splice(index, 1)
      }
  
      const addStep = () => {
        form.analyzedInstructions[0].steps.push({ step: '' })
      }
  
      const removeStep = (index) => {
        form.analyzedInstructions[0].steps.splice(index, 1)
      }
  
      const handleSubmit = async () => {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return
  
        loading.value = true
        try {
          emit('submit', { ...form })
        } finally {
          loading.value = false
        }
      }
  
      return {
        form,
        v$,
        loading,
        addIngredient,
        removeIngredient,
        addStep,
        removeStep,
        handleSubmit
      }
    }
  }
  </script>
  
  <style scoped>
  .image-preview {
    width: 100%;
    height: 200px;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6c757d;
  }
  
  .no-image i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  </style> 