<script setup lang="ts">
import { useOngoingGame } from '@renderer/composables/useGame';
import Surface from '@renderer/components/ui/Surface.vue';
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import Container from '@renderer/components/ui/Container.vue';
const { data: ongoingGame } = useOngoingGame();
</script>

<template>
  <div v-if="ongoingGame" class="ongoing-game-banner">
    You have an ongoing game !
    <router-link :to="{ name: 'GameSession', params: { id: ongoingGame.id } }">
      Join
    </router-link>
  </div>
  <div class="default-layout">
    <Surface as="header">
      <Container>
        <ButtonBase
          v-if="ongoingGame"
          class="play-button"
          :to="{ name: 'GameSession', params: { id: ongoingGame.id } }"
        >
          Rejoin Game
        </ButtonBase>
        <ButtonBase v-else to="/matchmaking" class="play-button">
          Play
        </ButtonBase>
      </Container>
    </Surface>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="postcss">
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

.default-layout {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;

  & > header {
    padding: var(--space-4);
  }
}
.play-button {
  font-size: var(--text-size-5);
}
</style>
