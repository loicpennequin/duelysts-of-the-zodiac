<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { trpcClient } from '../trpc';

const email = ref('');
const { mutate } = useMutation(
  ['lostPassword'],
  trpcClient.user.sendResetPasswordEmail.mutate
);
</script>

<template>
  <div>
    <form @submit.prevent="mutate({ email })">
      <h2>Lost your password ?</h2>
      <p>
        Please fill the form below. We will send you an e-mail containing a link
        to select a new password.
      </p>
      <fieldset>
        <label for="email">E-mail</label>
        <input type="email" v-model="email" />
      </fieldset>

      <button>Send password reset email</button>
    </form>
  </div>
</template>
