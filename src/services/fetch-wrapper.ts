import router from "@/router";
import { useAlertStore } from "@/stores/alert.store";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const fetchWrapper = {
    get: get,
    post: post,
};

const alertStore = useAlertStore();

/**
 * Must be awaited!
 * @param url Endpoint where we want to make our request.
 * @param data Object that we want to post.
 * @template ReturnType Object that we expect to be received (Keep empty if not sure).
 * @returns Object of type ReturnType
 * @example
 * const loginData = { login: "test", password: "test" };
 * const user: User = await post<User>("/our-fake-api/login", loginData);
 */
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

/**
 * Must be awaited!
 * @param url Endpoint where we want to make our request.
 * @template GetType Object that we expect to be received (Keep empty if not sure).
 * @returns Object of type GetType
 */
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

/**
 * @param error Error that is caused during api request
 */
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
