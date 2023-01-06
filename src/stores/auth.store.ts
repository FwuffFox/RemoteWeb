import router from "@/router";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/services/fetch-wrapper";

const BASE_URL = "https://localhost:5173/api";

export const useAuthStore = defineStore({
    id: "Auth",
    state: () => ({
        user: JSON.parse(localStorage.getItem("user") as string),
        returnUrl: null,
    }),
    actions: {
        async login(username: string, password: string) {
            const token = await fetchWrapper.post<string>(
                BASE_URL + "/auth/login",
                {
                    username: username,
                    password: password,
                }
            );
            if (token == null) return;
            localStorage.setItem("username", username);
            localStorage.setItem("token", token);
            const user = await fetchWrapper.get<any>(
                BASE_URL + `/user?username=${username}`
            );
            this.user = user;
            localStorage.setItem("user", JSON.stringify(user));
            router.push(this.returnUrl || "/");
        },
        logout() {
            this.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            router.push("/auth/login");
        },
    },
});
