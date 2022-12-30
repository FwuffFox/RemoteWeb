<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
    <div class="session">
        <div class="left">
            <svg
                enable-background="new 0 0 300 302.5"
                version="1.1"
                viewBox="0 0 300 302.5"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    class="st01"
                    d="m126 302.2c-2.3 0.7-5.7 0.2-7.7-1.2l-105-71.6c-2-1.3-3.7-4.4-3.9-6.7l-9.4-126.7c-0.2-2.4 1.1-5.6 2.8-7.2l93.2-86.4c1.7-1.6 5.1-2.6 7.4-2.3l125.6 18.9c2.3 0.4 5.2 2.3 6.4 4.4l63.5 110.1c1.2 2 1.4 5.5 0.6 7.7l-46.4 118.3c-0.9 2.2-3.4 4.6-5.7 5.3l-121.4 37.4zm63.4-102.7c2.3-0.7 4.8-3.1 5.7-5.3l19.9-50.8c0.9-2.2 0.6-5.7-0.6-7.7l-27.3-47.3c-1.2-2-4.1-4-6.4-4.4l-53.9-8c-2.3-0.4-5.7 0.7-7.4 2.3l-40 37.1c-1.7 1.6-3 4.9-2.8 7.2l4.1 54.4c0.2 2.4 1.9 5.4 3.9 6.7l45.1 30.8c2 1.3 5.4 1.9 7.7 1.2l52-16.2z"
                />
            </svg>
        </div>
        <form action="" class="log-in" autocomplete="off">
            <h4>Мы <span>Remote</span></h4>
            <p>Добро пожаловать!</p>
            <div class="floating-label">
                <input
                    placeholder="Почта"
                    type="email"
                    name="email"
                    id="email"
                    autocomplete="off"
                />
                <label for="email">Почта:</label>
                <div class="icon">
                    <svg
                        enable-background="new 0 0 100 100"
                        version="1.1"
                        viewBox="0 0 100 100"
                        xml:space="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g transform="translate(0 -952.36)">
                            <path
                                d="m17.5 977c-1.3 0-2.4 1.1-2.4 2.4v45.9c0 1.3 1.1 2.4 2.4 2.4h64.9c1.3 0 2.4-1.1 2.4-2.4v-45.9c0-1.3-1.1-2.4-2.4-2.4h-64.9zm2.4 4.8h60.2v1.2l-30.1 22-30.1-22v-1.2zm0 7l28.7 21c0.8 0.6 2 0.6 2.8 0l28.7-21v34.1h-60.2v-34.1z"
                            />
                        </g>
                        <rect class="st0" width="100" height="100" />
                    </svg>
                </div>
            </div>
            <div class="floating-label">
                <input
                    placeholder="Пароль"
                    type="password"
                    name="password"
                    id="password"
                    autocomplete="off"
                />
                <label for="password">Пароль:</label>
                <div class="icon">
                    <svg
                        enable-background="new 0 0 24 24"
                        version="1.1"
                        viewBox="0 0 24 24"
                        xml:space="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect class="st0" width="24" height="24" />
                        <path
                            class="st1"
                            d="M19,21H5V9h14V21z M6,20h12V10H6V20z"
                        />
                        <path
                            class="st1"
                            d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z"
                        />
                        <path
                            class="st1"
                            d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z"
                        />
                    </svg>
                </div>
            </div>
            <button type="submit">Войти</button>
            <RouterLink class="link-button" to="/auth/register">
                <button>Регистрация</button>
            </RouterLink>
            <a href="" class="discrete" target="_blank">Помощь</a>
        </form>
    </div>
</template>

<style scoped lang="scss">
@use "../../assets/colors.scss" as colors;
@use "../../assets/main.scss" as main;
* {
    font-family: -apple-system, BlinkMacSystemFont, "San Francisco", Helvetica,
        Arial, sans-serif;
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
    height: auto;
    margin: auto auto;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.12);
}
.left {
    width: 220px;
    height: auto;
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
.st0 {
    fill: none;
}
.st1 {
    fill: #010101;
}
</style>
