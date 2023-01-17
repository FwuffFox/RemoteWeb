import { useAlertStore } from "@/stores/alert.store";
import { createRouter, createWebHistory } from "vue-router";
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("@/views/MessengerView.vue"),
        },
        {
            path: "/auth/login",
            name: "login",
            component: () => import("@/views/auth/LoginView.vue"),
        },
        {
            path: "/auth/register",
            name: "register",
            component: () => import("@/views/auth/RegisterView.vue"),
        },
        {
            path: "/error/500",
            name: "internal_server_error",
            component: () => import("@/views/error_pages/Error500View.vue"),
        },
        {
            path: "/:pathMatch(.*)*", // Not existing paths
            name: "NotFound",
            redirect: "/",
        },
    ],
});

// TODO: Authorization

router.beforeEach((to, from, next) => {
    const alertStore = useAlertStore();
    alertStore.clear();
    const publicPages = ["/auth/login", "/auth/register", "/error/500"];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem("token");

    if (authRequired && !loggedIn) {
        console.log("User is not logged in. Redirecting to /auth/login");
        return next("/auth/login");
    }

    next();
});

export default router;
