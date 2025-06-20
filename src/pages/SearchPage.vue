<template>
  <div class="container py-4">
    <h2 class="mb-4">Search Recipes</h2>
    
    <!-- Search form -->
    <div class="card mb-4">
      <div class="card-body">
        <form @submit.prevent="search">
          <div class="row g-3">
            <div class="col-md-6">
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Search recipes..."
              >
            </div>
            <div class="col-md-2">
              <select v-model="cuisine" class="form-select">
                <option value="">Cuisine</option>
                <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="diet" class="form-select">
                <option value="">Diet</option>
                <option v-for="d in diets" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="intolerances" class="form-select">
                <option value="">Intolerances</option>
                <option v-for="i in intoleranceOptions" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="d-flex align-items-center">
                <label class="me-2">Results per page:</label>
                <select v-model="resultsPerPage" class="form-select w-auto">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-center justify-content-end">
                <label class="me-2">Sort by:</label>
                <select v-model="sortBy" class="form-select w-auto">
                  <option value="popularity">Popularity</option>
                  <option value="time">Prep Time</option>
                </select>
              </div>
            </div>
          </div>

          <div class="text-center mt-3">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Search results -->
    <div v-if="searched" class="search-results">
      <div v-if="recipes.length > 0" class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="recipe in recipes" :key="recipe.id" class="col">
          <RecipePreview :recipe="recipe" />
        </div>
      </div>
      <div v-else class="text-center py-5">
        <h3>No matches found</h3>
        <p class="text-muted">Try adjusting your search criteria</p>
      </div>
    </div>

    <!-- Last search - only show if user is logged in -->
    <div v-if="username && lastSearch && lastSearch.query && !searched" class="card">
      <div class="card-body">
        <h3 class="card-title">Last Search</h3>
        <p class="text-muted">Your last search was: {{ lastSearch.query }}</p>
        <button class="btn btn-outline-primary" @click="loadLastSearch">
          View Last Search Results
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RecipePreview from '@/components/RecipePreview.vue';
import axios from 'axios';

export default {
  name: 'SearchPage',
  components: {
    RecipePreview
  },
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const cuisine = ref('');
    const diet = ref('');
    const intolerances = ref('');
    const resultsPerPage = ref(5);
    const sortBy = ref('popularity');
    const recipes = ref([]);
    const loading = ref(false);
    const searched = ref(false);

    // Computed properties for better reactivity
    const username = computed(() => store.getters.username);
    const lastSearch = computed(() => store.getters.lastSearch);

    const cuisines = [
      'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
      'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
      'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
      'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern',
      'Spanish', 'Thai', 'Vietnamese'
    ];

    const diets = [
      'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
      'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
    ];

    const intoleranceOptions = [
      'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood',
      'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
    ];

    const search = async () => {
      try {
        loading.value = true;
        const params = {
          query: searchQuery.value,
          cuisine: cuisine.value,
          diet: diet.value,
          intolerances: intolerances.value,
          number: resultsPerPage.value,
          sort: sortBy.value
        };

        const response = await axios.get(`${store.getters.server_domain}/recipes/search`, { params });
        recipes.value = response.data;
        console.log('Search results with viewed status:', response.data);
        // Sort recipes client-side
        if (sortBy.value === 'popularity') {
          recipes.value.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (sortBy.value === 'time') {
          recipes.value.sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
        }
        searched.value = true;
        
        // Save search parameters only if user is logged in
        if (username.value) {
          store.dispatch('saveLastSearch', params);
        }
      } catch (error) {
        console.error('Error searching recipes:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadLastSearch = () => {
      const lastSearchData = lastSearch.value;
      searchQuery.value = lastSearchData.query;
      cuisine.value = lastSearchData.cuisine;
      diet.value = lastSearchData.diet;
      intolerances.value = lastSearchData.intolerances;
      resultsPerPage.value = lastSearchData.number;
      sortBy.value = lastSearchData.sort;
      search();
    };

    const refreshSearchResults = () => {
      if (searched.value && recipes.value.length > 0) {
        // Re-run the last search to get updated viewed status
        search();
      }
    };

    // Refresh data when page becomes visible (e.g., returning from recipe view)
    onMounted(() => {
      const handleVisibilityChange = () => {
        if (!document.hidden && searched.value) {
          refreshSearchResults();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    });

    return {
      searchQuery,
      cuisine,
      diet,
      intolerances,
      resultsPerPage,
      sortBy,
      recipes,
      loading,
      searched,
      username,
      lastSearch,
      cuisines,
      diets,
      intoleranceOptions,
      search,
      loadLastSearch
    };
  }
}
</script>
  