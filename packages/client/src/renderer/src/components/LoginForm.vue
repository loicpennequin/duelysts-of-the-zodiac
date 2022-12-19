<script setup lang="ts">
import { useLogin } from '@renderer/composables/useAuth';
import { REMEMBER_ME_LOCAL_STORAGE } from '@renderer/utils/constants';
import ButtonBase from './ui/Button/ButtonBase.vue';
import Surface from '@renderer/components/ui/Surface.vue';
import TextInput from './ui/TextInput.vue';
import Checkbox from './ui/Checkbox.vue';
import PasswordInput from './ui/PasswordInput.vue';
import AppTitle from './AppTitle.vue';

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
  <Surface class="login-form">
    <AppTitle />
    <form space-y-2 @submit.prevent="mutate(form)">
      <fieldset>
        <label for="email">E-mail address</label>
        <TextInput id="email" v-model="form.email" type="email" />
      </fieldset>
      <fieldset>
        <label for="password">Password</label>
        <PasswordInput id="password" v-model="form.password" />
      </fieldset>

      <fieldset>
        <Checkbox id="remember-me" v-model="rememberMe" type="checkbox">
          Remember me
        </Checkbox>
      </fieldset>

      <footer justify-between gap-5>
        <ButtonBase>Login</ButtonBase>
        <a :href="lostPasswordUrl" target="_blank">Forgot password ?</a>
      </footer>
      <p v-if="error" style="color: red">{{ error }}</p>
    </form>
  </Surface>
</template>

<style scoped lang="postcss">
.login-form {
  width: 100vw;
  max-width: 40rem;
}

form > * + * {
  margin-top: var(--space-5);
}

form > fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

form > footer {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--space-6);
}

form > footer > a {
  font-size: var(--text-size-2);
  text-decoration: underline;

  &:focus {
    color: var(--color-accent);
  }
}
</style>
