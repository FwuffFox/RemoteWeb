import { defineStore } from "pinia";

enum AlertType {
    Error,
    Warning,
    Success,
    Info,
}

class Alert {
    message: string;
    type: AlertType;

    constructor(message: string, type: AlertType) {
        this.message = message;
        this.type = type;
    }
}

export const useAlertStore = defineStore({
    id: "Alert",
    state: () => ({
        alert: null as Alert | null,
    }),
    actions: {
        success(message: string) {
            this.alert = new Alert(message, AlertType.Success);
        },
        warning(message: string) {
            this.alert = new Alert(message, AlertType.Warning);
        },
        error(message: string) {
            this.alert = new Alert(message, AlertType.Error);
        },
        /** Clears alert */
        clear() {
            this.alert = null;
        },
    },
});


