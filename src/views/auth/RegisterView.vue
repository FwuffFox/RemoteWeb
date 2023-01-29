<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useAlertStore } from "@/stores/alert.store";
import router from "@/router";
import * as Yup from "yup";
import { Field, Form, configure } from "vee-validate";
import { IconPeople, IconLock} from "@/components/icons";

const authStore = useAuthStore();
const alertStore = useAlertStore();

if (authStore.isLoggedIn) {
    router.push("/");
}

async function onSubmit(values: any) {
    alertStore.clear();

    const { username, first_password, fullName, jobTitle } = values;
    console.debug("register in with values:", values);

    await authStore.register(username, first_password, fullName, jobTitle);
}

async function invalidSubmit(error_date: any) {
    alertStore.clear();
}

const schema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Введите имя пользователя\n"),

    fullName: Yup.string().required("Введите ваше полное имя\n"),

    jobTitle: Yup.string().required("Введите вашу должность\n"),

    first_password: Yup.string()
        .required("Длина пароля должна быть не меньше 8 символов\n")
        .min(8, "Длина пароля должна быть не меньше 8 символов\n"),

    second_password: Yup.string().oneOf([Yup.ref("first_password"), undefined], "Пароли не совпадают\n"),
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
    <div class="session d-flex">
        <div class="left" />
        <div class="register-container">
            <Form
                class="register w-75"
                @submit="onSubmit"
                @invalid-submit="invalidSubmit"
                :validation-schema="schema"
                v-slot="{ errors }"
            >
                <h4>Регистрация</h4>

                <v-alert v-if="alertStore.alert?.message" type="error" variant="flat">{{
                        alertStore.alert?.message
                    }}</v-alert>

                <div class="floating-label">
                    <Field
                        placeholder="Имя пользователя"
                        v-model="username"
                        type="username"
                        name="username"
                        id="username"
                        autocomplete="on"
                    />
                    <label for="username">Имя Пользователя:</label>
                    <div class="icon">
                        <IconPeople />
                    </div>
                </div>
                <VAlert class="w-100" type="error" variant="text" v-if="errors.username">
                    {{ errors.username }}
                </VAlert>

                <div class="floating-label">
                    <Field
                        placeholder="Фамилия Имя Отчество"
                        type="common"
                        name="fullName"
                        id="fullName"
                        autocomplete="on"
                    />
                    <label for="fullName">Фамилия Имя Отчество:</label>
                    <div class="icon">
                        <IconPeople />
                    </div>
                </div>
                <VAlert class="w-100" type="error" variant="text" v-if="errors.fullName">
                    {{ errors.fullName }}
                </VAlert>

                <div class="floating-label">
                    <Field
                        placeholder="Должность"
                        type="common"
                        name="jobTitle"
                        id="jobTitle"
                        autocomplete="on"
                    />
                    <label for="jobTitle">Должность:</label>
                </div>
                <VAlert class="w-100" type="error" variant="text" v-if="errors.jobTitle">
                    {{ errors.jobTitle }}
                </VAlert>

                <div class="floating-label">
                    <Field
                        placeholder="Пароль"
                        type="password"
                        name="first_password"
                        id="first_password"
                        autocomplete="off"
                    />
                    <label for="first_password">Пароль:</label>
                    <div class="icon">
                        <IconLock />
                    </div>
                </div>
                <VAlert class="w-100" type="error" variant="text" v-if="errors.first_password">
                    {{ errors.first_password }}
                </VAlert>

                <div class="floating-label">
                    <Field
                        placeholder="Пароль ещё раз"
                        type="password"
                        name="second_password"
                        id="second_password"
                        autocomplete="off"
                    />
                    <label for="second_password">Пароль:</label>
                    <div class="icon">
                        <IconLock />
                    </div>
                </div>
                <VAlert class="w-100" type="error" variant="text" v-if="errors.second_password">
                    {{ errors.second_password }}
                </VAlert>

                <div class="group">
                    <button type="submit">Отправить</button>
                </div>

                <RouterLink class="link-button" to="/auth/login">
                    <button>К входу</button>
                </RouterLink>
                <a href="" class="discrete" target="_blank">Помощь</a>
            </Form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../../assets/colors.scss" as colors;
$primary: colors.$primary-color;
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

label {
    font-size: 12.5px;
    color: #000;
    opacity: 0.8;
    font-weight: 400;
}
.link-button {
    &:hover {
        background-color: transparent;
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
    box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.13);
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
    padding: 20px 0;
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
Form {
    background: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 30px 20px;
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

    .icon_in_center {
        position: relative;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        background-color: green;
    }
}
.register-container {
    display: flex;
    width: 50%;
    justify-content: center;
}

.register {
    align-items: center;
    align-self: center;
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

@media screen and (max-width: 620px) {
    .left {
        display: none;
    }

    .register-container {
        width: 100%;
    }
}
</style>
