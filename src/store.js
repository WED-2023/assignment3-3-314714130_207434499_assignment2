import { createStore } from 'vuex';
import axios from 'axios';
axios.defaults.withCredentials = true;

const store = createStore({
  state() {
    return {
      username: localStorage.getItem('username'),
      server_domain: "http://localhost:3000",
      lastWatchedRecipes: JSON.parse(localStorage.getItem('lastWatchedRecipes') || '[]'),
      favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
      lastSearch: JSON.parse(localStorage.getItem('lastSearch') || '{}'),
      showCreateRecipeModal: false,
    };
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
      localStorage.setItem('username', username);
    },
    clearUsername(state) {
      state.username = undefined;
      localStorage.removeItem('username');
    },
    setLastWatchedRecipes(state, recipes) {
      state.lastWatchedRecipes = recipes;
      localStorage.setItem('lastWatchedRecipes', JSON.stringify(recipes));
    },
    setFavorites(state, favorites) {
      state.favorites = favorites;
      localStorage.setItem('favorites', JSON.stringify(favorites));
    },
    addFavorite(state, recipe) {
      state.favorites.push(recipe);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    removeFavorite(state, recipeId) {
      state.favorites = state.favorites.filter(r => r.id !== recipeId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setLastSearch(state, searchParams) {
      state.lastSearch = searchParams;
      localStorage.setItem('lastSearch', JSON.stringify(searchParams));
    },
    setShowCreateRecipeModal(state, value) {
      state.showCreateRecipeModal = value;
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post(`http://localhost:3000/Login`, {
          username,
          password
        });
        
        if (response.status === 200) {
          commit('setUsername', username);
          console.log("login successful", username);
          return response.data;
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    async logout({ commit }) {
      try {
        await axios.post(`http://localhost:3000/Logout`);
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        commit('clearUsername');
        commit('setFavorites', []);
        commit('setLastWatchedRecipes', []);
        console.log("logout successful");
      }
    },
    addToLastWatched({ state, commit }, recipe) {
      // Don't add family recipes or self-created recipes to last watched
      if (recipe.isFamily || recipe.isSelfCreated || recipe.id.toString().startsWith('family_')) {
        return;
      }

      // Only proceed if it's a Spoonacular recipe (numeric ID)
      if (!recipe.id || isNaN(Number(recipe.id))) {
        return;
      }

      if (state.username) {
        // User is logged in, update on server
        axios.post(`${state.server_domain}/users/viewed`, { recipeId: recipe.id })
          .then(() => {
            // Update local state
            const recipes = [...state.lastWatchedRecipes];
            const index = recipes.findIndex(r => r.id === recipe.id);
            if (index !== -1) {
              recipes.splice(index, 1);
            }
            recipes.unshift(recipe);
            if (recipes.length > 3) {
              recipes.pop();
            }
            commit('setLastWatchedRecipes', recipes);
          })
          .catch(err => {
            console.error('Error marking recipe as viewed:', err);
          });
      } else {
        // Not logged in, update localStorage as fallback
        const recipes = [...state.lastWatchedRecipes];
        const index = recipes.findIndex(r => r.id === recipe.id);
        if (index !== -1) {
          recipes.splice(index, 1);
        }
        recipes.unshift(recipe);
        if (recipes.length > 3) {
          recipes.pop();
        }
        commit('setLastWatchedRecipes', recipes);
      }
    },
    async fetchLastWatched({ state, commit }) {
      if (!state.username) {
        commit('setLastWatchedRecipes', []);
        return;
      }
      try {
        const response = await axios.get(`${state.server_domain}/users/lastViewed`);
        commit('setLastWatchedRecipes', response.data);
      } catch (error) {
        console.error('Error fetching last watched recipes:', error);
        // If we get a 401, the session is invalid - clear the user
        if (error.response && error.response.status === 401) {
          commit('clearUsername');
          commit('setFavorites', []);
        }
        commit('setLastWatchedRecipes', []);
      }
    },
    async toggleFavorite({ state, commit }, recipe) {
      try {
        const index = state.favorites.findIndex(r => r.id === recipe.id);
        if (index === -1) {
          await axios.post(`${state.server_domain}/users/favorites`, { recipeId: recipe.id });
          commit('addFavorite', recipe);
        } else {
          await axios.delete(`${state.server_domain}/users/favorites/${recipe.id}`);
          commit('removeFavorite', recipe.id);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }
    },
    saveLastSearch({ commit }, searchParams) {
      commit('setLastSearch', searchParams);
    },
    async fetchFavorites({ state, commit }) {
      if (!state.username) {
        commit('setFavorites', []);
        return;
      }
      try {
        const response = await axios.get(`${state.server_domain}/users/favorites`);
        commit('setFavorites', response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // If we get a 401, the session is invalid - clear the user
        if (error.response && error.response.status === 401) {
          commit('clearUsername');
          commit('setLastWatchedRecipes', []);
        }
        commit('setFavorites', []);
      }
    },
    async fetchFamilyRecipes({ state }) {
      try {
        const response = await axios.get(`${state.server_domain}/users/familyRecipes`);
        return response.data;
      } catch (error) {
        console.error('Error fetching family recipes:', error);
        throw error;
      }
    },
    async fetchMyRecipes({ state }) {
      try {
        const response = await axios.get(`${state.server_domain}/users/myRecipes`);
        return response.data;
      } catch (error) {
        console.error('Error fetching my recipes:', error);
        throw error;
      }
    },
    async createRecipe({ state }, recipe) {
      try {
        const response = await axios.post(
          `${state.server_domain}/users/create`,
          recipe
        );
        return response.data;
      } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
      }
    },
    async updateRecipe({ state }, recipeId, recipe) {
      try {
        const response = await axios.put(`${state.server_domain}/recipes/${recipeId}`, recipe);
        return response.data;
      } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
      }
    },
    async deleteRecipe({ state }, recipeId) {
      try {
        await axios.delete(`${state.server_domain}/recipes/${recipeId}`);
      } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
      }
    }
  },
  getters: {
    isFavorite: (state) => (recipeId) => {
      return state.favorites.some(r => r.id === recipeId);
    },
    username: (state) => state.username,
    server_domain: (state) => state.server_domain,
    lastWatchedRecipes: (state) => state.lastWatchedRecipes,
    favorites: (state) => state.favorites,
    lastSearch: (state) => state.lastSearch,
    showCreateRecipeModal: (state) => state.showCreateRecipeModal
  }
});

export default store;
