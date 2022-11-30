<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: string }>(), { as: 'div' });
</script>

<template>
  <component :is="props.as" class="surface">
    <slot />
  </component>
</template>

<style scoped lang="postcss">
.surface {
  background-color: var(--color-surface);
  backdrop-filter: blur(0.5rem);
  padding: var(--space-8);
}
</style>
