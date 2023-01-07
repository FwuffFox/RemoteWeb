import router from "@/router";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/services/fetch-wrapper";

const BASE_URL = "https://localhost:5173/api";

export const useAuthStore = defineStore({
    id: "Auth",
    state: () => ({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") as string) as any | null,
        returnUrl: null,
    }),
    actions: {
        async login(username: string, password: string) {
            this.token = await fetchWrapper.post<string>(
                BASE_URL + "/auth/login",
                {
                    username: username,
                    password: password,
                }
            );
            if (this.token == null) return;
            localStorage.setItem("username", username);
            localStorage.setItem("token", this.token);
            this.user = await fetchWrapper.get<any>(
                BASE_URL + `/user?username=${username}`
            );
            localStorage.setItem("user", JSON.stringify(this.user));
            router.push(this.returnUrl || "/");
        },
        logout() {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            router.push("/auth/login");
            this.$reset();
        },
    },
});
