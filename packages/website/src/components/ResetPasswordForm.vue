<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { trpcClient } from '../trpc';

const { isLoading, mutate, error, isSuccess } = useMutation(
  ['resetPassword'],
  trpcClient.user.resetPassword.mutate
);

const password = ref('');

const onSubmit = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const { token } = Object.fromEntries(urlSearchParams.entries());

  mutate({ token, password: password.value });
};
</script>

<template>
  <h2>Password reset</h2>
  <form @submit.prevent="onSubmit" v-if="!isSuccess">
    <fieldset>
      <label for="password">Please select a new password.</label>
      <input type="password" v-model="password" />
      <label for="password-confirm">Confirm your new password</label>
      <input id="password-confirm" type="password" />
    </fieldset>

    <button :disabled="isLoading">Confirm</button>
    <p style="color: red" v-if="error">{{ error }}</p>
  </form>
  <p v-if="isSuccess">Password changed successfully.</p>
</template>
