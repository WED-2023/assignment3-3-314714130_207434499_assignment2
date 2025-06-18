<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <div class="row">
      <!-- Left Column: Explore these recipes -->
      <div class="col-md-6">
        <RecipePreviewList 
          title="Explore these recipes"
          :recipes="randomRecipes"
          :loading="loadingRandomRecipes"
          class="RandomRecipes center"
        />
        <div class="text-center mt-3 mb-4">
          <button class="btn btn-primary" @click="fetchRandomRecipes">
            Explore More
          </button>
        </div>
      </div>

      <!-- Right Column: Last Viewed Recipes or Login/Register -->
      <div class="col-md-6">
        <div v-if="store.getters.username">
          <RecipePreviewList
            title="Last Viewed Recipes"
            :recipes="store.getters.lastWatchedRecipes"
            class="RandomRecipes center"
          />
        </div>
        <div v-else class="text-center mt-4">
          <h3 class="mb-3">Login to see your last viewed recipes!</h3>
          <router-link :to="{ name: 'login' }">
            <button class="btn btn-primary me-2">Login</button>
          </router-link>
          <router-link :to="{ name: 'register' }">
            <button class="btn btn-outline-primary">Register</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import axios from 'axios';

export default {
  components: {
    RecipePreviewList
  },
  setup() {
    const store = useStore();
    const randomRecipes = ref([]);
    const loadingRandomRecipes = ref(false);

    const fetchRandomRecipes = async () => {
      try {
        loadingRandomRecipes.value = true;
        const response = await axios.get(`${store.getters.server_domain}/recipes/random`);
        randomRecipes.value = response.data;
        console.log("Random Recipes Data:", randomRecipes.value);
      } catch (error) {
        console.error('Error fetching random recipes:', error);
      } finally {
        loadingRandomRecipes.value = false;
      }
    };

    // Fetch last watched recipes when user logs in
    onMounted(() => {
      fetchRandomRecipes();
      if (store.getters.username) {
        store.dispatch('fetchLastWatched');
      }
    });
    watch(() => store.getters.username, (newVal) => {
      if (newVal) {
        store.dispatch('fetchLastWatched');
      } else {
        store.commit('setLastWatchedRecipes', []);
      }
    });

    return {
      store,
      randomRecipes,
      loadingRandomRecipes,
      fetchRandomRecipes
    };
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style>
