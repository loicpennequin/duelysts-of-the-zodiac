<script setup lang="ts">
import { useLogin } from '@renderer/composables/useAuth';
import { REMEMBER_ME_LOCAL_STORAGE } from '@renderer/utils/constants';

const form = reactive({
  email: '',
  password: ''
});
const rememberMe = useStorage(REMEMBER_ME_LOCAL_STORAGE, false);

const { mutate, error } = useLogin();
const lostPasswordUrl = `${
  import.meta.env.RENDERER_VITE_WEBSITE_URL
}/lost-password`;
</script>

<template>
  <form @submit.prevent="mutate(form)">
    <fieldset>
      <label for="email">E-mail address</label>
      <input id="email" v-model="form.email" type="email" />
    </fieldset>
    <fieldset>
      <label for="password">Password</label>
      <input id="password" v-model="form.password" type="password" />
    </fieldset>

    <fieldset>
      <input id="remember-me" v-model="rememberMe" type="checkbox" />
      <label for="remember-me">Remember me</label>
    </fieldset>
    <button>Login</button>
    <a :href="lostPasswordUrl" target="_blank">Forgot password ?</a>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<style scoped></style>
