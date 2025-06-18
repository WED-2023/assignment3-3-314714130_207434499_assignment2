import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import FavoritesPage from "../pages/FavoritesPage.vue";
import MyRecipesPage from "../pages/MyRecipesPage.vue";

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
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipePage.vue"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesPage,
  },
  {
    path: "/my-recipes",
    name: "my-recipes",
    component: MyRecipesPage,
  },
  {
    path: "/family-recipes",
    name: "family-recipes",
    component: () => import("../pages/FamilyRecipesPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;
