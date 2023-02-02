import router from "@/router";
import { defineStore } from "pinia";
import { fetchWrapperService } from "@/services/fetchWrapper.service";
import type { User } from "@/models/User";

const BASE_URL = `${window.location.origin}/api`;

export const useAuthStore = defineStore({
    id: "Auth",
    state: () => ({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") as string) as User | null,
        returnUrl: null,
    }),
    getters: {
        isLoggedIn: (store) => {
            return store.token != null || store.user != null;
        },
        getUser: (store) => store.user as User,
    },
    actions: {
        async initialization_after_login(username: string) {
            if (this.token == null) return;
            localStorage.setItem("username", username);
            localStorage.setItem("token", this.token);

            this.user = await fetchWrapperService.get<User>(BASE_URL + `/user?username=${username}`);
            localStorage.setItem("user", JSON.stringify(this.user));
            await router.push(this.returnUrl || "/");
            this.returnUrl = null;
        },

        async login(username: string, password: string) {
            this.token = await fetchWrapperService.post<string>(BASE_URL + "/auth/login", {
                username: username,
                password: password,
            });

            await this.initialization_after_login(username);
        },

        async register(username: string, password: string, fullName: string, jobTitle: string) {
            this.token = await fetchWrapperService.post<string>(BASE_URL + "/auth/register", {
                username: username,
                password: password,
                fullName: fullName,
                jobTitle: jobTitle,
            });

            await this.initialization_after_login(username);
        },

        async logout() {
            await router.push("/auth/login");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            this.$reset();
        },
    },
});
