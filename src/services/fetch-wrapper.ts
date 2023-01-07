import router from "@/router";
import { useAlertStore } from "@/stores/alert.store";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const fetchWrapper = {
    get: get,
    post: post,
};

const alertStore = useAlertStore();

async function post<ReturnType = any>(
    url: string,
    data: any
): Promise<ReturnType | null> {
    try {
        const response = await axios.post<ReturnType>(url, data, {
            headers: {
                Authorization: authHeader(),
            },
        });
        console.table(response.data);
        return response.data;
    } catch (error) {
        catchAxiosError(error);
    }
    return null;
}

async function get<GetType>(url: string): Promise<GetType | null> {
    try {
        const response = await axios.get<GetType>(url, {
            headers: {
                Authorization: authHeader(),
            },
        });
        console.table(response.data);
        return response.data;
    } catch (error) {
        catchAxiosError(error);
    }
    return null;
}

function authHeader(): string {
    const token = localStorage.getItem("token");
    if (token != null) {
        return `Bearer ${token}`;
    } else return "";
}

function catchAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        console.error(error);
        const { user, logout } = useAuthStore();
        if ([401, 403].includes(error.response?.status!) && user) {
            logout();
        } else if (error.response?.status! == 500) {
            router.push("/error/500");
        }
        console.log(error.response!);
        alertStore.error(error.response?.data.errors || error.response?.data);
    }
}