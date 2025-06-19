<template>
  <div class="container main-container">
    <div class="welcome-section mb-5">
      <h1 class="welcome-title">Welcome to Import.Food</h1>
      <p class="welcome-subtitle">Discover amazing recipes from around the world</p>
    </div>
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
        <div v-if="username">
          <RecipePreviewList
            title="Last Viewed Recipes"
            :recipes="lastWatchedRecipes"
            :loading="loadingLastWatched"
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
import { ref, computed, onMounted, watch } from 'vue';
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
    const loadingLastWatched = ref(false);

    const username = computed(() => store.getters.username);
    const lastWatchedRecipes = computed(() => store.getters.lastWatchedRecipes);

    const fetchRandomRecipes = async () => {
      try {
        loadingRandomRecipes.value = true;
        const response = await axios.get(`${store.getters.server_domain}/recipes/random`);
        randomRecipes.value = response.data;
      } catch (error) {
        console.error('Error fetching random recipes:', error);
      } finally {
        loadingRandomRecipes.value = false;
      }
    };

    const fetchLastWatched = async () => {
      if (!username.value) return;
      
      try {
        loadingLastWatched.value = true;
        await store.dispatch('fetchLastWatched');
      } catch (error) {
        console.error('Error fetching last watched recipes:', error);
      } finally {
        loadingLastWatched.value = false;
      }
    };

    // Fetch initial data
    onMounted(async () => {
      await fetchRandomRecipes();
      if (username.value) {
        try {
          await store.dispatch('fetchFavorites');
          await fetchLastWatched();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Clear user data when not logged in
        store.commit('setFavorites', []);
        store.commit('setLastWatchedRecipes', []);
        store.commit('setLastSearch', {});
        sessionStorage.removeItem('lastSearch');
      }
    });

    // Watch for user login/logout
    watch(() => username.value, async (newVal) => {
      if (newVal) {
        try {
        await store.dispatch('fetchFavorites');
        await fetchLastWatched();
        } catch (error) {
          console.error('Error fetching user data after login:', error);
        }
      } else {
        store.commit('setLastWatchedRecipes', []);
        store.commit('setFavorites', []);
        store.commit('setLastSearch', {});
        sessionStorage.removeItem('lastSearch');
      }
    });

    return {
      username,
      randomRecipes,
      lastWatchedRecipes,
      loadingRandomRecipes,
      loadingLastWatched,
      fetchRandomRecipes
    };
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 30px;
  padding: 30px;
  margin-top: 30px;
  margin-left: 15px;
  margin-right: 15px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  max-width: none;
}

.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 25px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
}

.welcome-subtitle {
  font-size: 1.3rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
}

.RandomRecipes {
  margin: 20px 0;
}

.col-md-6 {
  padding: 0 10px;
}

.col-md-6 > div {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 25px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.col-md-6 > div:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.btn {
  border-radius: 15px;
  padding: 12px 30px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-outline-primary {
  border: 2px solid #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

h3 {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 25px;
}

.blur {
  -webkit-filter: blur(5px);
  filter: blur(2px);
}

::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-container {
    margin-top: 20px;
    padding: 25px;
    border-radius: 20px;
  }
  
  .welcome-title {
    font-size: 2.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
  
  .col-md-6 {
    padding: 0 10px;
    margin-bottom: 30px;
  }
  
  .col-md-6 > div {
    padding: 20px;
  }
}
</style>
