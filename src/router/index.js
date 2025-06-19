import { createRouter, createWebHistory } from "vue-router";
import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipe/spoonacular/:recipeId",
    name: "spoonacularRecipe",
    component: () => import("../pages/SpoonacularRecipeViewPage.vue"),
    props: true
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    redirect: to => {
      // Redirect general recipe route to spoonacular route as fallback
      return { name: 'spoonacularRecipe', params: { recipeId: to.params.recipeId } }
    }
  },
  {
    path: "/recipe/family/:recipeId",
    name: "familyRecipe",
    component: () => import("../pages/FamilyRecipeViewPage.vue"),
  },
  {
    path: "/recipe/my/:recipeId",
    name: "myRecipe",
    component: () => import("../pages/SelfCreatedRecipeViewPage.vue"),
  },
  {
    path: "/recipe/my/:recipeId/edit",
    name: "editMyRecipe",
    component: () => import("../pages/EditRecipePage.vue"),
  },
  {
    path: "/recipe/new",
    name: "newRecipe",
    component: () => import("../pages/NewRecipePage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/AboutPage.vue"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../pages/FavoritesPage.vue"),
  },
  {
    path: "/family-recipes",
    name: "familyRecipes",
    component: () => import("../pages/FamilyRecipesPage.vue"),
  },
  {
    path: "/my-recipes",
    name: "myRecipes",
    component: () => import("../pages/MyRecipesPage.vue"),
  },
  {
    path: "/404",
    name: "notFound",
    component: NotFound,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
