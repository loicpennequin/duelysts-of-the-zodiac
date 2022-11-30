<script setup lang="ts">
import IconSpinner from '~icons/game-icons/sword-spin';
</script>

<template>
  <div
    class="animate__animated animate__flash animate__infinite wrapper"
    style="--animate-duration: 4s"
  >
    <IconSpinner class="spinner" />
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  --spinner-size: 3rem;
}
.spinner {
  font-size: var(--spinner-size);
  aspect-ratio: 1;
  animation: spin 2s infinite ease-out;
}
</style>
