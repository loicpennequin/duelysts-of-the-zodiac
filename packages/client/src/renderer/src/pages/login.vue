<script setup lang="ts">
import { useLogin } from '@renderer/composables/useAuth';

const form = reactive({
  email: '',
  password: ''
});
const rememberMe = useStorage('remember-me', false);
const error = ref<any>(null);

const { mutate } = useLogin();
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
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "Login"
}
</route>
