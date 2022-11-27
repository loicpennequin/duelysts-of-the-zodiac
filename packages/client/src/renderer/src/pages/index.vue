<script setup lang="ts">
import UserOnboardingModal from '@renderer/components/UserOnboardingModal.vue';
import { useLogout } from '@renderer/composables/useAuth';
import { useSession } from '@renderer/composables/useSession';

const { isLoading, data, refetch } = useSession();

const { mutate } = useLogout();
</script>

<template>
  <div v-if="isLoading">Loading profile...</div>
  <div v-else-if="data">
    <UserOnboardingModal />
    <h2>Hello, {{ data.username ?? 'there' }}</h2>
    <button @click="mutate()">Logout</button>
    <button @click="refetch()">Refresh Session</button>
  </div>
</template>

<route lang="json">
{
  "name": "Home"
}
</route>
