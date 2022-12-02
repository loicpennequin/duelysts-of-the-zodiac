<script setup lang="ts">
import { GameSessionDto } from '@dotz/shared';
import { createGameCanvas } from '@renderer/canvas';

const props = defineProps<{ gameSession: GameSessionDto }>();

const container = ref<HTMLDivElement>();
let canvasCleanup: () => void;

onMounted(async () => {
  if (!container.value) return;
  const { cleanup, canvas } = await createGameCanvas(
    container.value,
    props.gameSession
  );

  container.value.appendChild(canvas);
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';

  canvasCleanup = cleanup;
});

onUnmounted(() => {
  canvasCleanup();
  document.body.style.overflow = '';
  document.body.style.height = '';
});
</script>

<template><div ref="container" class="container" /></template>

<style scoped>
.container {
  height: 100%;
}
</style>
