import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const fetchWrapper = {
    get: get,
    post: post,
};

async function post<ReturnType = any>(
    url: string,
    data: any
): Promise<ReturnType> {
    return axios
        .post<ReturnType>(url, data, {
            headers: {
                Authorization: authHeader(),
            },
        })
        .then((response) => {
            console.debug(response);
            return response.data;
        });
}

async function get<GetType>(url: string): Promise<GetType> {
    return axios
        .get<GetType>(url, {
            headers: {
                Authorization: authHeader(),
            },
        })
        .then((response) => {
            console.table(response.data);
            return response.data;
        });
}

function authHeader(): string {
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    if (isLoggedIn) {
        return `Bearer ${user.token}`;
    } else return "";
}
