import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/search",
      name: "search",
      component: () => import("./views/Search.vue")
    },
    {
      path: "/bookmarks",
      name: "bookmarks",
      component: () => import("./views/Bookmarks.vue")
    },
    {
      path: "/translator",
      name: "translator",
      component: () => import("./views/Translator.vue")
    },
    {
      path: "/study",
      name: "study",
      component: () => import("./views/Study.vue")
    }
  ]
});
