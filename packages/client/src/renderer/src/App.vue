<script lang="ts" setup>
import { RouterView } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import { useLogout } from './composables/useAuth';
import { useSession } from './composables/useSession';
import { useSocket, useSocketEvent } from './composables/useSocket';

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
</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <LoginForm v-else-if="!session" />

  <component :is="currentLayout" v-else>
    <router-view />
  </component>
</template>
