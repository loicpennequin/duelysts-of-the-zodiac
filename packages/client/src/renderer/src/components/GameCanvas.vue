<script setup lang="ts">
import { GameWorldDto, UserDto } from '@dotz/shared';
import { useSession } from '@renderer/composables/useSession';
import { createGameCanvas } from '@renderer/game-engine';

const props = defineProps<{ gameId: string; gameWorld: GameWorldDto }>();

const { data: session } = useSession();
const container = ref<HTMLDivElement>();
let engine: any;

onMounted(async () => {
  if (!container.value) return;
  engine = await createGameCanvas({
    container: container.value,
    gameWorld: props.gameWorld,
    gameId: props.gameId,
    session: session.value as UserDto
  });
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
