<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { trpcClient } from '../trpc';

const email = ref('');
const { mutate, error, isSuccess } = useMutation(
  ['lostPassword'],
  trpcClient.user.sendResetPasswordEmail.mutate
);
</script>

<template>
  <h2>Lost your password ?</h2>
  <p>
    Please fill the form below. We will send you an e-mail containing a link to
    select a new password.
  </p>
  <form @submit.prevent="mutate({ email })">
    <fieldset>
      <label for="email">E-mail</label>
      <input type="email" v-model="email" />
    </fieldset>

    <button>Send password reset email</button>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="isSuccess">
      If an account with this e-mail address exists on our platform, an e-mail
      will be sent shortly (usually immediately).
    </p>
  </form>
</template>
