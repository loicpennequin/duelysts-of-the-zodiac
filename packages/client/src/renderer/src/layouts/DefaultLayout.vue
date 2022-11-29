<script setup lang="ts">
import { useOngoingGame } from '@renderer/composables/useGame';
const { data: ongoingGame } = useOngoingGame();
</script>

<template>
  <div v-if="ongoingGame" class="ongoing-game-banner">
    You have an ongoing game !
    <router-link :to="{ name: 'GameSession', params: { id: ongoingGame.id } }">
      Join
    </router-link>
  </div>
  <slot />
</template>

<style scoped>
.ongoing-game-banner {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: hsla(0, 70%, 45%);
  color: white;
}

.ongoing-game-banner > a {
  color: inherit;
}
</style>
