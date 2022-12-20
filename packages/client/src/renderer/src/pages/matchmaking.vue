<script setup lang="ts">
import { useOngoingGame } from '@renderer/composables/useGame';
import {
  useJoinRankedQueue,
  useLeaveRankedQueue
} from '@renderer/composables/useMatchmaking';
import Center from '@renderer/components/ui/Center.vue';
import Surface from '@renderer/components/ui/Surface.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import { useStopwatch } from '@renderer/composables/useStopwatch';

const { data: ongoingGame } = useOngoingGame();
const { formatedCounter, resume, reset } = useStopwatch();
const hasJoined = ref(false);

const { mutate: join } = useJoinRankedQueue({
  onSuccess() {
    hasJoined.value = true;
    resume();
  }
});

const { mutate: leave } = useLeaveRankedQueue({
  onSuccess() {
    hasJoined.value = false;
    reset();
  }
});

onUnmounted(() => {
  leave();
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
      <ButtonBase
        :disabled="!!ongoingGame"
        @click="hasJoined ? leave() : join()"
      >
        {{ hasJoined ? 'Leave queue' : 'Enter queue' }}
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
