<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">NavBar</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Main</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search">Search</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
          </ul>
  
          <div class="d-flex align-items-center">
            <template v-if="isLoggedIn">
              <span class="me-3">Hello, {{ username }}</span>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="personalDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Personal
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="personalDropdown">
                    <li><router-link class="dropdown-item" :to="{ name: 'favorites' }">Favorites</router-link></li>
                    <li><router-link class="dropdown-item" :to="{ name: 'my-recipes' }">Private</router-link></li>
                    <li><router-link class="dropdown-item" :to="{ name: 'family-recipes' }">La Familia</router-link></li>
                  </ul>
                </li>
              </ul>
              <button class="btn btn-primary me-3 ms-3" @click="openCreateRecipeModal">Create New Recipe</button>
              <button class="btn btn-outline-danger" @click="logout">Sign Out</button>
            </template>
            <template v-else>
              <span class="me-3">Hello guest</span>
              <router-link class="btn btn-outline-primary me-2" to="/login">Login</router-link>
              <router-link class="btn btn-primary" to="/register">Register</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'NavBar',
    setup() {
      const store = useStore()
      const router = useRouter()
  
      const isLoggedIn = computed(() => !!store.getters.username)
      const username = computed(() => store.getters.username)
  
      const logout = async () => {
        await store.dispatch('logout')
        router.push('/login')
      }
  
      const openCreateRecipeModal = () => {
        store.commit('setShowCreateRecipeModal', true)
      }
  
      return {
        isLoggedIn,
        username,
        logout,
        openCreateRecipeModal
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  </style> 