<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { trpcClient } from '../trpc';
import { reactive, ref } from 'vue';

const form = reactive({
  email: '',
  password: ''
});
const error = ref<any>(null);

const { mutate } = useMutation(
  ['signup'],
  () => trpcClient.user.create.mutate(form),
  {
    onSuccess() {
      window.location.assign('http://localhost:3000');
    },
    onError(err) {
      error.value = err;
    }
  }
);

const signUp = () => {
  mutate();
};
</script>

<template>
  <form @submit.prevent="signUp">
    <fieldset>
      <label for="email">E-mail address</label>
      <input id="email" type="email" v-model="form.email" />
    </fieldset>

    <fieldset>
      <label for="password">Password</label>
      <input id="password" type="password" v-model="form.password" />
      <label for="password-confirm">Confirm password</label>
      <input id="password-confirm" type="password" />
    </fieldset>

    <button>Sign up</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<style scoped></style>
