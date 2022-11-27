<script lang="ts" setup>
import { RouterView } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import { useRefreshJwt } from './composables/useAuth';
import { useSession } from './composables/useSession';

const rememberMe = useStorage('remember-me', false);
const { replace } = useRouter();

const redirectToHome = () => {
  replace({ name: 'Home' });
};

const { mutate: refreshJwt, isSuccess } = useRefreshJwt({
  onSuccess: redirectToHome
});

const { data: session } = useSession({
  enabled: computed(() => isSuccess.value)
});

onMounted(() => {
  if (rememberMe.value) refreshJwt();
});
</script>

<template>
  <LoginForm v-if="!session" />
  <router-view v-else />
</template>
