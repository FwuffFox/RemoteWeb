<script setup lang="ts">
import IconEmail from "@/components/icons/IconEmail.vue";
import IconLock from "@/components/icons/IconLock.vue";

import { RouterLink } from "vue-router";
import * as Yup from "yup";
import { Field, Form, configure } from "vee-validate";

import router from "@/router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.store";
import { useAlertStore } from "@/stores/alert.store";
import { onBeforeMount, ref, watch } from "vue";

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);

onBeforeMount(() => {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
        router.push("/");
    }
});

async function onSubmit(values: any) {
    alertStore.clear();

    const { username, password } = values;
    console.debug("logging in with values:", values);
    await useAuthStore().login(username, password);
}

async function invalidSubmit(values: any) {
    alertStore.clear();
}

const schema = Yup.object().shape({
    username: Yup.string()
        .min(2, "-Введите имя пользователя\n"),

    password: Yup.string()
        .required("-Длина пароля должна быть не меньше 8 символов\n")
        .min(8, "-Длина пароля должна быть не меньше 8 символов\n"),
});

configure({
    validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
    validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
    validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
    validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});

const username = ref("");
watch(username, (newValue, oldValue) => {
    newValue = newValue.trim();
    if (!newValue.startsWith("@")) newValue = "@" + newValue;
    username.value = newValue;
});
</script>

<template>
    <div class="session">
        <div class="left" />
        <div class="login-container">
            <Form
                class="log-in"
                @submit="onSubmit"
                @invalid-submit="invalidSubmit"
                :validation-schema="schema"
                v-slot="{ errors }"
            >
                <h4>Мы <span>Remote</span></h4>
                <p>Добро пожаловать!</p>

                <v-alert v-if="alert" type="error" variant="flat">{{ alert?.message }}</v-alert>

                <div class="style_error_messege">
                    {{ errors.username }}
                </div>
                <div class="floating-label">
                    <Field
                        placeholder="Имя Пользователя"
                        v-model="username"
                        type="username"
                        name="username"
                        id="username"
                        autocomplete="on"
                    />
                    <label for="username">Имя Пользователя:</label>
                    <div class="icon">
                        <IconEmail />
                    </div>
                    <ErrorMessage name="username" />
                </div>
                <div class="style_error_messege">
                    {{ errors.password }}
                </div>
                <div class="floating-label">
                    <Field
                        placeholder="Пароль"
                        type="password"
                        name="password"
                        id="password"
                        autocomplete="off"
                    />
                    <label for="password">Пароль:</label>
                    <div class="icon">
                        <IconLock />
                    </div>
                </div>

                <button type="submit">Войти</button>
                <RouterLink class="link-button" to="/auth/register">
                    <button>К регистрации</button>
                </RouterLink>
                <a href="" class="discrete" target="_blank">Помощь</a>
            </Form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../../assets/colors.scss" as colors;
@use "../../assets/main.scss" as main;
* {
    font-family: -apple-system, BlinkMacSystemFont, "San Francisco", Helvetica, Arial, sans-serif;
    font-weight: 300;
    margin: 0;
}
$primary: colors.$primary-color;
html,
body {
    height: 100vh;
    width: 100vw;
    margin: 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
.log-in {
    align-items: center;
    align-self: center;
}
h4 {
    font-size: 24px;
    font-weight: 600;
    color: black;
    opacity: 0.85;
}
label {
    font-size: 12.5px;
    color: #000;
    opacity: 0.8;
    font-weight: 400;
}
form {
    padding: 40px 30px 20px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 300px;
    h4 {
        margin-bottom: 20px;
        color: rgba($primary, 0.5);
        span {
            color: rgba($primary, 1);
            font-weight: 700;
        }
    }
    p {
        line-height: 155%;
        font-size: 14px;
        color: #000;
        opacity: 0.65;
        font-weight: 400;
        max-width: 200px;
        margin-bottom: 40px;
    }
}

.style_error_messege {
    width: 100%;
    background-color: orange;
}
.link-button {
    &:hover {
        background-color: transparent;
    }
}
a.discrete {
    color: rgba(#000, 0.4);
    font-size: 14px;
    border-bottom: solid 1px rgba(#000, 0);
    padding-bottom: 4px;
    margin-left: auto;
    font-weight: 300;
    transition: all 0.3s ease;
    margin-top: 40px;
    &:hover {
        border-bottom: solid 1px rgba(#000, 0.2);
    }
}
button {
    width: auto;
    min-width: 100px;
    border-radius: 24px;
    text-align: center;
    padding: 15px 40px;
    margin-top: 5px;
    background-color: saturate($primary, 30%);
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.13);
    border: none;
    transition: all 0.3s ease;
    outline: 0;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 2px 6px -1px rgba($primary, 0.65);
        &:active {
            transform: scale(0.99);
        }
    }
}
input {
    font-size: 16px;
    padding: 20px 0px;
    height: 56px;
    border: none;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    background: #fff;
    width: 280px;
    box-sizing: border-box;
    transition: all 0.3s linear;
    color: #000;
    font-weight: 400;
    &:focus {
        border-bottom: solid 1px $primary;
        outline: 0;
        box-shadow: 0 2px 6px -8px rgba($primary, 0.45);
    }
}
.floating-label {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    label {
        position: absolute;
        top: calc(50% - 7px);
        left: 0;
        opacity: 0;
        transition: all 0.3s ease;
        padding-left: 44px;
    }
    input {
        width: calc(100% - 44px);
        margin-left: auto;
        display: flex;

        &:not(:placeholder-shown) {
            padding: 28px 0px 12px 0px;
        }

        &:not(:placeholder-shown) + label {
            transform: translateY(-10px);
            opacity: 0.7;
        }

        &:valid:not(:placeholder-shown) + label + .icon {
            svg {
                opacity: 1;
                fill: $primary;
                path {
                    fill: $primary;
                }
            }
        }

        &:not(:valid):not(:focus) + label + .icon {
            animation-name: shake-shake;
            animation-duration: 0.3s;
        }
    }
    .icon {
        position: absolute;
        top: 0;
        left: 0;
        height: 56px;
        width: 44px;
        display: flex;
        svg {
            height: 30px;
            width: 30px;
            margin: auto;
            opacity: 0.15;
            transition: all 0.3s ease;
            path {
                transition: all 0.3s ease;
            }
        }
    }
}
$displacement: 3px;
@keyframes shake-shake {
    0% {
        transform: translateX(-$displacement);
    }
    20% {
        transform: translateX($displacement);
    }
    40% {
        transform: translateX(-$displacement);
    }
    60% {
        transform: translateX($displacement);
    }
    80% {
        transform: translateX(-$displacement);
    }
    100% {
        transform: translateX(0px);
    }
}
.session {
    display: flex;
    flex-direction: row;
    width: auto;
    height: 100vh !important;
    margin: auto auto;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.12);
}
.left {
    width: 50%;
    min-height: 100%;
    position: relative;
    background-image: url("https://img.freepik.com/free-vector/gradient-dynamic-lines-background_23-2149020285.jpg?w=826&t=st=1672227568~exp=1672228168~hmac=19b6f9f37f6d3f26229269851337ea8896db8ef92d727254f93f5e4bfb19d764");
    background-size: cover;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    svg {
        height: 40px;
        width: auto;
        margin: 20px;
    }
}

.login-container {
    display: flex;
    width: 50%;
    justify-content: center;
}
</style>
