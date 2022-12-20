<script setup lang="ts">
import { GameWorldDto } from '@dotz/shared';
import { createGameCanvas } from '@renderer/game-engine';

const props = defineProps<{ gameId: string; gameWorld: GameWorldDto }>();

const container = ref<HTMLDivElement>();
let engine: any;

onMounted(async () => {
  if (!container.value) return;
  engine = await createGameCanvas(
    container.value,
    props.gameWorld,
    props.gameId
  );
  const { canvas } = engine;
  container.value.appendChild(canvas);
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';
});

onUnmounted(() => {
  engine?.cleanup();
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
