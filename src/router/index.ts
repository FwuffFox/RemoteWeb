import { createRouter, createWebHistory } from "vue-router";
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/MessengerView.vue"),
        },
        {
            path: "/auth/login",
            name: "login",
            component: () => import("../views/auth/LoginView.vue"),
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
    const publicPages = ["/auth/login", "/auth/register"];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem("user");

    if (authRequired && !loggedIn) {
        console.log("User is not logged in. Redirecting to /auth/login");
        return next("/auth/login");
    }

    next();
});

export default router;
