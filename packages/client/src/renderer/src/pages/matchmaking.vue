<script setup lang="ts">
import { GAME_FOUND } from '@dotz/shared';
import { useOngoingGame } from '@renderer/composables/useGame';
import {
  useJoinRankedQueue,
  useLeaveRankedQueue
} from '@renderer/composables/useMatchmaking';
import { useSocketEvent } from '@renderer/composables/useSocket';
import Center from '@renderer/components/ui/Center.vue';
import Surface from '@renderer/components/ui/Surface.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';

const hasJoined = ref(false);
const counterInSeconds = ref(0);
const formatedCounter = computed(() => {
  const minutes = Math.round(counterInSeconds.value / 60);
  const seconds = counterInSeconds.value % 60;

  return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(
    2,
    '0'
  )}`;
});
const { pause, resume } = useIntervalFn(
  () => {
    counterInSeconds.value++;
  },
  1000,
  { immediate: false }
);

const router = useRouter();

const { data: ongoingGame } = useOngoingGame();

const { mutate: join } = useJoinRankedQueue({
  onSuccess() {
    hasJoined.value = true;
    resume();
  }
});

const { mutate: leave } = useLeaveRankedQueue({
  onSuccess() {
    hasJoined.value = false;
    pause();
    counterInSeconds.value = 0;
  }
});

onUnmounted(() => {
  leave();
});

useSocketEvent(GAME_FOUND, payload => {
  router.push({ name: 'GameSession', params: { id: payload.gameId } });
});
</script>

<template>
  <Center>
    <Surface class="matchmaking">
      <div
        class="counter"
        :class="!hasJoined && 'counter--hidden'"
        :aria-hidden="!hasJoined"
      >
        {{ formatedCounter }}
      </div>
      <ButtonBase v-if="hasJoined" :disabled="!!ongoingGame" @click="leave()">
        Leave queue
      </ButtonBase>
      <ButtonBase v-else :disabled="!!ongoingGame" @click="join()">
        Enter queue
      </ButtonBase>
    </Surface>
  </Center>
</template>

<style scoped lang="postcss">
.matchmaking {
  width: calc(var(--breakpoints-sm) / 2);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: center;
}
.counter {
  text-align: center;
  font-size: var(--text-size-6);
  transition: opacity var(--duration-2);
  opacity: 1;

  &.counter--hidden {
    opacity: 0;
  }
}
</style>

<route lang="json">
{
  "name": "Matchmaking",
  "meta": {
    "bg": "img/matchmaking.png"
  }
}
</route>
