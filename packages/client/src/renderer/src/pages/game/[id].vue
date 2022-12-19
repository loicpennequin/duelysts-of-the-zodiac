<script setup lang="ts">
import { GameWorldDto, GAME_ENDED, GET_GAME_WORLD } from '@dotz/shared';
import EndGameModal from '@renderer/components/EndGameModal.vue';
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import { useGameSession, useSurrender } from '@renderer/composables/useGame';
import { useSocketEvent, useSocket } from '@renderer/composables/useSocket';
import { queryKeys } from '@renderer/utils/constants';
import Modal from '@renderer/components/ui/Modal/index.vue';
import ModalContent from '@renderer/components/ui/Modal/ModalContent.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import GameCanvas from '@renderer/components/GameCanvas.vue';
import Surface from '@renderer/components/ui/Surface.vue';
import { useSession } from '@renderer/composables/useSession';
import Center from '@renderer/components/ui/Center.vue';
import Spinner from '@renderer/components/ui/Spinner.vue';

const route = useRoute('GameSession');

const gameWorld = ref<GameWorldDto>();
const qc = useQueryClient();
const gameSessionQuery = useGameSession(route.params.id, {
  onSuccess(data) {
    socket.emit(GET_GAME_WORLD, data.id, world => {
      gameWorld.value = world;
    });
  }
});
const socket = useSocket();

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
    <template #loading>
      <Center>
        <Surface>
          <Spinner />
        </Surface>
      </Center>
    </template>

    <template #error="{ error }">
      <Center>
        <p>{{ error }}</p>
        <router-link to="/">Back to home</router-link>
      </Center>
    </template>

    <template #default="{ data: gameSession }">
      <EndGameModal :game-session="gameSession" />

      <Modal v-model:is-opened="isMenuOpened" closable title="Options">
        <ModalContent>
          <ButtonBase @click="onSurrender">Surrender</ButtonBase>
        </ModalContent>
      </Modal>

      <div class="game-screen">
        <GameCanvas
          v-if="gameWorld"
          :game-world="gameWorld"
          class="game-canvas"
        />

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
