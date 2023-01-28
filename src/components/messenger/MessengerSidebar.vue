<script setup lang="ts">
import LogoutButton from "@/components/LogoutButton.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.store";

const { user } = storeToRefs(useAuthStore());
</script>

<template>
    <div id="sidebar">
        <div class="header">
            <h5>Чаты</h5>
        </div>
        <div class="profile">
            <div class="d-flex align-items-center flex-grow-1">
                <v-avatar class="me-2" size="50" color="blue">
                    <span>CJ</span>
                </v-avatar>
                <a v-if:="user">{{ user.fullName.split(" ")[1] }}</a>
            </div>
            <LogoutButton />
        </div>
    </div>
</template>

<style scoped>

</style>