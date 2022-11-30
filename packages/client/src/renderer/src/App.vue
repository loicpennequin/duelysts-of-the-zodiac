<script lang="ts" setup>
import { RouterView } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import { useLogout } from './composables/useAuth';
import { useSession } from './composables/useSession';
import { useSocket, useSocketEvent } from './composables/useSocket';
import Spinner from './components/ui/Spinner.vue';

const socket = useSocket();
const { data: session, isLoading } = useSession({
  onSuccess(data) {
    if (data && !socket.connected) {
      socket.connect();
    }
  }
});

const { mutate: logout } = useLogout();
useSocketEvent('connect_error', () => {
  logout();
});
useSocketEvent('disconnect', () => {
  logout();
});

const layoutMap = {
  default: defineAsyncComponent(
    () => import('@renderer/layouts/DefaultLayout.vue')
  ),
  gameSession: defineAsyncComponent(
    () => import('@renderer/layouts/GameSessionLayout.vue')
  )
};
const router = useRouter();
const currentLayout = computed(() => {
  const key = router.currentRoute.value.meta.layout ?? 'default';
  return layoutMap[key as string];
});

const bg = computed(
  () =>
    `url(${
      session.value ? router.currentRoute.value.meta.bg : 'img/login.png'
    })`
);
</script>

<template>
  <div class="app">
    <Spinner v-if="isLoading" />
    <template v-else>
      <div v-if="!session" class="login-wrapper">
        <LoginForm />
      </div>
      <component :is="currentLayout" v-else>
        <router-view />
      </component>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.app {
  min-height: 100vh;
  background: v-bind(bg);
  background-blend-mode: overlay;
  background-size: cover;
  background-position: right;
  transition: all var(--duration-3);
}

.login-wrapper {
  min-height: 100vh;
  display: grid;
  height: 100%;
  place-content: center;
}
</style>
