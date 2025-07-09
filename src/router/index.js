import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/graph",
      name: "graph",
      component: () => import("../views/GraphView.vue"),
    },
    {
      path: "/list",
      name: "list",
      component: () => import("../views/DataList.vue"),
    },
  ],
});

export default router;
