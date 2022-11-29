<script setup lang="ts">
import { useSession } from '@renderer/composables/useSession';
import { useUserOnboarding } from '@renderer/composables/useUser';

const { data: session } = useSession();
const isOpened = computed(() => session.value && !session.value.username);
const username = ref('');
const { mutate, error } = useUserOnboarding();
</script>

<template>
  <div v-if="isOpened">
    <h2>Almost done !</h2>
    <p>You're almost ready to play !</p>
    <p>We just need you to select a username below</p>

    <form @submit.prevent="mutate({ username })">
      <label for="onboarding-username">My username is</label>
      <input id="onboarding-username" v-model="username" />
      <button>Let's go ! 🚀</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>
