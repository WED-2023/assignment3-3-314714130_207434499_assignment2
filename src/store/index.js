import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    serverDomain: process.env.VUE_APP_SERVER_DOMAIN || "http://localhost:3000",
    username: localStorage.getItem("username") || "",
    favorites: [],
    lastWatchedRecipes: []
  },

  getters: {
    username: state => state.username,
    serverDomain: state => state.serverDomain,
    favorites: state => state.favorites,
    isFavorite: state => recipeId => state.favorites.includes(recipeId),
    lastWatchedRecipes: state => state.lastWatchedRecipes
  },

  mutations: {
    SET_USERNAME(state, username) {
      state.username = username;
      localStorage.setItem("username", username);
    },
    LOGOUT(state) {
      state.username = "";
      state.lastWatchedRecipes = [];
      state.favorites = [];
      localStorage.removeItem("username");
    },
    SET_FAVORITES(state, favorites) {
      state.favorites = favorites;
    },
    ADD_FAVORITE(state, recipeId) {
      if (!state.favorites.includes(recipeId)) {
        state.favorites.push(recipeId);
      }
    },
    REMOVE_FAVORITE(state, recipeId) {
      state.favorites = state.favorites.filter(id => id !== recipeId);
    },
    SET_LAST_WATCHED(state, recipes) {
      state.lastWatchedRecipes = recipes;
    },
    ADD_TO_LAST_WATCHED(state, recipe) {
      const index = state.lastWatchedRecipes.findIndex(r => r.id === recipe.id);
      if (index !== -1) {
        state.lastWatchedRecipes.splice(index, 1);
      }
      state.lastWatchedRecipes.unshift(recipe);
      if (state.lastWatchedRecipes.length > 3) {
        state.lastWatchedRecipes.pop();
      }
    }
  },

  actions: {
    async login({ commit, dispatch, state }, { username, password }) {
      try {
        const response = await axios.post(
          `${state.serverDomain}/Login`,
          { username, password }
        );
        commit("SET_USERNAME", username);
        await dispatch("fetchFavorites");
        await dispatch("fetchLastWatched");
        return response;
      } catch (error) {
        throw error;
      }
    },
    async register({ commit, state }, { username, password, firstname, lastname, email, country }) {
      try {
        const response = await axios.post(
          `${state.serverDomain}/Register`,
          { username, password, firstname, lastname, email, country }
        );
        commit("SET_USERNAME", username);
        return response;
      } catch (error) {
        throw error;
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    async fetchFavorites({ commit, state }) {
      if (!state.username) return;
      
      try {
        const response = await axios.get(
          `${state.serverDomain}/users/favorites`
        );
        const favoriteIds = response.data.map(recipe => recipe.id);
        commit("SET_FAVORITES", favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        if (error.response?.status === 401) {
          commit("LOGOUT");
        }
        throw error;
      }
    },
    async fetchLastWatched({ commit, state }) {
      if (!state.username) return;
      
      try {
        const response = await axios.get(
          `${state.serverDomain}/users/lastViewed`
        );
        commit("SET_LAST_WATCHED", response.data);
      } catch (error) {
        console.error("Error fetching last watched:", error);
        if (error.response?.status === 401) {
          commit("LOGOUT");
        }
        throw error;
      }
    },
    async addFavorite({ commit, state }, recipeId) {
      try {
        await axios.post(
          `${state.serverDomain}/users/favorites`,
          { recipeId }
        );
        commit("ADD_FAVORITE", recipeId);
      } catch (error) {
        console.error("Error adding favorite:", error);
        if (error.response?.status === 401) {
          commit("LOGOUT");
        }
        throw error;
      }
    },
    async removeFavorite({ commit, state }, recipeId) {
      try {
        await axios.delete(
          `${state.serverDomain}/users/favorites/${recipeId}`
        );
        commit("REMOVE_FAVORITE", recipeId);
      } catch (error) {
        console.error("Error removing favorite:", error);
        if (error.response?.status === 401) {
          commit("LOGOUT");
        }
        throw error;
      }
    },
    async toggleFavorite({ commit, getters, state, dispatch }, recipe) {
      if (!state.username) return;

      try {
        const response = await fetch(`${getters.serverDomain}/user/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            recipeId: recipe.id
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to toggle favorite');
        }
        
        // Transform the recipe to match our preview format before adding to favorites
        const transformedRecipe = {
          id: recipe.id,
          title: recipe.title,
          readyInMinutes: recipe.readyInMinutes,
          image: recipe.image,
          popularity: recipe.popularity || recipe.aggregateLikes || 0,
          vegan: recipe.vegan,
          vegetarian: recipe.vegetarian,
          glutenFree: recipe.glutenFree,
          isFavorite: true
        };
        
        commit('ADD_FAVORITE', transformedRecipe.id);
        
        // Update last watched recipes to reflect the new favorite status
        await dispatch('fetchLastWatched');
      } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }
    },
    async addToLastWatched({ commit, dispatch, state }, recipe) {
      if (!state.username) return;
      
      try {
        // First, mark the recipe as viewed in the backend
        await fetch(`${state.serverDomain}/user/viewed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            recipeId: recipe.id
          }),
        });
        
        // Add favorite status to the recipe
        const recipeWithFavorite = {
          ...recipe,
          isFavorite: state.favorites.some(f => f.id === recipe.id)
        };
        
        commit('ADD_TO_LAST_WATCHED', recipeWithFavorite);
      } catch (error) {
        console.error('Error adding to last watched:', error);
      }
    }
  },
});

// Initialize if user is logged in
if (store.state.username) {
  Promise.all([
    store.dispatch('fetchFavorites'),
    store.dispatch('fetchLastWatched')
  ]).catch(console.error);
}

export default store; 