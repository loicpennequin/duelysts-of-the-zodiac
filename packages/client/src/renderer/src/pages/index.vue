<script setup lang="ts">
import UserOnboardingModal from '@renderer/components/UserOnboardingModal.vue';
import { useLogout } from '@renderer/composables/useAuth';
import { useSession } from '@renderer/composables/useSession';

const { isLoading, data } = useSession();

const { mutate } = useLogout();
</script>

<template>
  <div v-if="isLoading">Loading profile...</div>
  <div v-else-if="data">
    <UserOnboardingModal />
    <h2 v-if="data.username">
      Welcome back, {{ data.username }}#{{ data.usernameTag }}
    </h2>
    <h2 v-else>Hello, There</h2>
    <button @click="mutate()">Logout</button>
    <router-link to="/matchmaking">Play</router-link>
  </div>
</template>

<route lang="json">
{
  "name": "Home"
}
</route>
