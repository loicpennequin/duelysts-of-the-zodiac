<script setup lang="ts">
import { useLogout } from '@renderer/composables/useAuth';
import { useSession } from '@renderer/composables/useSession';

const { isLoading, data } = useSession();

const { mutate } = useLogout();
</script>

<template>
  <div v-if="isLoading">Loading profile...</div>
  <div v-else-if="data">
    <h2>Hello, {{ data.email }}</h2>
    <button @click="mutate()">Logout</button>
  </div>
</template>

<route lang="json">
{
  "name": "Home"
}
</route>
