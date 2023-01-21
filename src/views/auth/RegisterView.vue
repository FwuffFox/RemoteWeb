<script setup lang="ts">
import { Field, Form } from "vee-validate";
var count = 0;

function onButtonClick() {
    count += 1;
}
</script>

<template>
    <div class="session">
        <div class="left" />
        <div class="register-container">
            <Form action="">
                <h4>Регистрация</h4>
                <div class="floating-label">
                    <Field
                        placeholder="Имя пользователя"
                        type="username"
                        name="username"
                        id="username"
                        autocomplete="on"
                    />
                    <label for="username">Имя Пользователя:</label>
                    <div class="icon">
                        <v-icon icon="mdi-account" />
                    </div>
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
                        <v-icon icon="mdi-lock-outline" />
                    </div>
                </div>
                <div class="group">
                    <RouterLink class="link-button" to="/auth/register">
                        <button @click="onButtonClick">Далее</button>
                    </RouterLink>
                </div>
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
h1 {
    cursor: help;
    margin: 0;
    text-transform: uppercase;
    padding-bottom: 5px;
}
label {
    font-size: 12.5px;
    color: #000;
    opacity: 0.8;
    font-weight: 400;
}
form {
    padding: 40px 30px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 20px;
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
        margin-bottom: 5px;
        font-size: 14px;
        color: #000;
        opacity: 0.65;
        font-weight: 400;
        max-width: 200px;
        margin-bottom: 40px;
    }
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
.register-container{
    display: flex;
    width: 50%;
    justify-content: center;
}
</style>
