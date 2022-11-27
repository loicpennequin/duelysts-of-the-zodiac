<script lang="ts" setup>
import { RouterView } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import { useSession } from './composables/useSession';

const { data: session, isLoading } = useSession();
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <LoginForm v-else-if="!session" />
  <router-view v-else />
</template>
