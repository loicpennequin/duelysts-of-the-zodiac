<script setup lang="ts">
import { GAME_FOUND } from '@dotz/shared';
import {
  useJoinRankedQueue,
  useLeaveRankedQueue
} from '@renderer/composables/useMatchmaking';
import { useSocketEvent } from '@renderer/composables/useSocket';

const hasJoined = ref(false);

const { mutate: join } = useJoinRankedQueue({
  onSuccess() {
    hasJoined.value = true;
  }
});

const { mutate: leave } = useLeaveRankedQueue({
  onSuccess() {
    hasJoined.value = false;
  }
});

onUnmounted(() => {
  leave();
});

useSocketEvent(GAME_FOUND, payload => {
  console.log('game found', payload);
});
</script>

<template>
  <router-link to="/">Back</router-link>
  <h2>Matchmaking page</h2>
  <button v-if="hasJoined" @click="leave()">Cancel</button>
  <button v-else @click="join()">Search for opponent</button>
</template>

<style scoped></style>
