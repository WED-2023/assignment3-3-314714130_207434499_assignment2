<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">Import.Food</router-link>
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
                    <li><router-link class="dropdown-item" :to="{ name: 'myRecipes' }">Private</router-link></li>
                    <li><router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">La Familia</router-link></li>
                  </ul>
                </li>
              </ul>
              <button class="btn btn-primary me-3 ms-3" @click="navigateToNewRecipe">Create New Recipe</button>
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
  
      const navigateToNewRecipe = () => {
        router.push('/recipe/new')
      }
  
      return {
        isLoggedIn,
        username,
        logout,
        navigateToNewRecipe
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 20px 20px;
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1050;
  }

  .navbar-brand {
    font-weight: 700;
    font-size: 1.8rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
  }

  .navbar-brand:hover {
    transform: scale(1.05);
    transition: all 0.3s ease;
  }

  .nav-link {
    font-weight: 500;
    color: #2c3e50 !important;
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 8px 16px !important;
    margin: 0 4px;
  }

  .nav-link:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea !important;
    transform: translateY(-1px);
  }

  .dropdown-menu {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(10px);
    z-index: 10000 !important;
    min-width: 180px;
    padding: 8px;
    right: 0 !important;
    left: auto !important;
    transform: translateX(0) !important;
    position: absolute !important;
  }

  .dropdown-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;
  }

  .dropdown-item:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  .dropdown {
    position: relative !important;
  }

  .dropdown-toggle {
    position: relative !important;
  }

  .btn {
    border-radius: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 8px 20px;
  }
  </style> 