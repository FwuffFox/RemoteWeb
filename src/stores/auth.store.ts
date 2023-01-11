import router from "@/router";
import { defineStore } from "pinia";
import { fetchWrapper } from "@/services/fetch-wrapper";
import type { IUser } from "@/models/IUser";

const BASE_URL = `${window.location.origin}/api`;

export const useAuthStore = defineStore({
    id: "Auth",
    state: () => ({
        token: localStorage.getItem("token"),
        user: JSON.parse(
            localStorage.getItem("user") as string
        ) as IUser | null,
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

            this.user = await fetchWrapper.get<IUser>(
                BASE_URL + `/user?username=${username}`
            );
            localStorage.setItem("user", JSON.stringify(this.user));
            router.push(this.returnUrl || "/");
        },
        logout() {
            router.push("/auth/login");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            this.$reset();
        },
    },
});
