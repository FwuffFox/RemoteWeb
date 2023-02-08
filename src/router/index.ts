import { useAlertStore } from "@/stores/alert.store";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
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
            path: "/:chatName",
            name: "chat",
            component: () => import("@/views/ChatView.vue"),
        },
        {
            path: "/:pathMatch(.*)*", // Not existing paths
            name: "NotFound",
            redirect: "/",
        },
    ],
});

router.beforeEach((to, from, next) => {
    useAlertStore().clear();
    const isPublic = to.path.startsWith("/auth") || to.path.startsWith("/error");
    const loggedIn = useAuthStore().isLoggedIn;

    if (!isPublic && !loggedIn) {
        console.log("User is not logged in. Redirecting to /auth/login");
        return next("/auth/login");
    }

    next();
});

export default router;
