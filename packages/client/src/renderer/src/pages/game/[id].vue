<script setup lang="ts">
import { GAME_ENDED } from '@dotz/shared';
import EndGameModal from '@renderer/components/EndGameModal.vue';
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import { useGameSession, useSurrender } from '@renderer/composables/useGame';
import { useSocketEvent } from '@renderer/composables/useSocket';
import { queryKeys } from '@renderer/utils/constants';
import Modal from '@renderer/components/ui/Modal/index.vue';
import ModalContent from '@renderer/components/ui/Modal/ModalContent.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import GameCanvas from '@renderer/components/GameCanvas.vue';
import Surface from '@renderer/components/ui/Surface.vue';
import { useSession } from '@renderer/composables/useSession';

const route = useRoute('GameSession');

const qc = useQueryClient();
const gameSessionQuery = useGameSession(route.params.id);

const { mutate: surrender } = useSurrender({
  onSuccess(data) {
    qc.setQueryData(queryKeys.GAME_SESSION(route.params.id), data);
  }
});

const onSurrender = () => {
  surrender(gameSessionQuery.data.value!.id);
  isMenuOpened.value = false;
};

useSocketEvent(GAME_ENDED, ({ gameSession }) => {
  qc.setQueryData(queryKeys.GAME_SESSION(route.params.id), gameSession);
});

const isMenuOpened = ref(false);
useEventListener(window, 'keyup', e => {
  if (e.code === 'Escape') {
    isMenuOpened.value = true;
  }
});

const { data: session } = useSession();
const currentUser = computed(() =>
  gameSessionQuery.data.value?.users.find(user => user.id === session.value?.id)
);
const opponent = computed(() =>
  gameSessionQuery.data.value?.users.find(user => user.id !== session.value?.id)
);
</script>

<template>
  <QueryLoader :query="gameSessionQuery">
    <template #loading>Loading game...</template>

    <template #default="{ data: gameSession }">
      <EndGameModal :game-session="gameSession" />

      <Modal v-model:is-opened="isMenuOpened" closable title="Options">
        <ModalContent>
          <ButtonBase @click="onSurrender">Surrender</ButtonBase>
        </ModalContent>
      </Modal>

      <div class="game-screen">
        <GameCanvas :game-session="gameSession" class="game-canvas" />

        <Surface v-if="currentUser" class="player-widget">
          {{ currentUser.username }}#{{ currentUser.usernameTag }}
        </Surface>

        <Surface
          v-if="opponent"
          class="player-widget player-widget--is-opponent"
        >
          {{ opponent.username }}#{{ opponent.usernameTag }}
        </Surface>
      </div>
    </template>
  </QueryLoader>
</template>

<style scoped lang="postcss">
.game-screen {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr;
  user-select: none;

  & > .game-canvas {
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }
}

.player-widget {
  padding: var(--space-3);
  grid-column: 1;
  grid-row: 1;
  font-size: var(--text-size-5);

  &.player-widget--is-opponent {
    grid-column: 3;
    text-align: right;
  }
}
</style>

<route lang="json">
{
  "name": "GameSession",
  "meta": { "layout": "gameSession", "bg": "/img/game-session.png" }
}
</route>
