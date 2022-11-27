<script lang="ts" setup>
import { useRefreshJwt } from './composables/useAuth';
import { useSession } from './composables/useSession';

const isLoading = ref(true);
const rememberMe = useStorage('remember-me', false);
const { replace } = useRouter();

const redirectToLogin = () => {
  replace({ name: 'Login' });
  isLoading.value = false;
};

const redirectToHome = () => {
  replace({ name: 'Home' });
  isLoading.value = false;
};

const isRefreshed = ref(false);
const { mutate } = useRefreshJwt({
  onSuccess() {
    isRefreshed.value = true;
  },
  onError: redirectToLogin
});

useSession(
  computed(() => ({
    onSuccess: redirectToHome,
    onError: redirectToLogin,
    enabled: isRefreshed.value
  }))
);

onMounted(() => {
  if (!rememberMe.value) {
    redirectToLogin();
  } else {
    mutate();
  }
});
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <router-view v-else />
</template>
