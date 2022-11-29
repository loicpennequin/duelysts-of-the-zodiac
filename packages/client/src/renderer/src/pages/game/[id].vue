<script setup lang="ts">
import { useGameSession } from '@renderer/composables/useGame';

const route = useRoute('GameSession');

const { data: gameSession } = useGameSession(route.params.id);
</script>

<template>
  <div>Game page</div>
  <pre>{{ gameSession }}</pre>
  <button>Surrender</button>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "GameSession"
}
</route>
