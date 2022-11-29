<script setup lang="ts">
import { GAME_ENDED } from '@dotz/shared';
import QueryLoader from '@renderer/components/QueryLoader/index.vue';
import { useGameSession, useSurrender } from '@renderer/composables/useGame';
import { useSocketEvent } from '@renderer/composables/useSocket';
import { queryKeys } from '@renderer/utils/constants';

const route = useRoute('GameSession');
const router = useRouter();

const qc = useQueryClient();
const gameSessionQuery = useGameSession(route.params.id);

const { mutate: surrender } = useSurrender({
  onSuccess(data) {
    qc.setQueryData(queryKeys.GAME_SESSION(route.params.id), data);
  }
});

useSocketEvent(GAME_ENDED, ({ gameSession }) => {
  qc.setQueryData(queryKeys.GAME_SESSION(route.params.id), gameSession);
  router.push({ name: 'Home' });
});
</script>

<template>
  <div>Game page</div>
  <QueryLoader :query="gameSessionQuery">
    <template #loading>Loading game...</template>

    <template #default="{ data: gameSession }">
      <div v-if="gameSession.endedAt">
        This game has already ended.
        <router-link to="/">Back to home page</router-link>
      </div>
      <data v-else>
        <pre>{{ gameSession }}</pre>
        <button @click="surrender(gameSession.id)">Surrender</button>
      </data>
    </template>
  </QueryLoader>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "GameSession",
  "meta": { "layout": "gameSession" }
}
</route>