<script setup lang="ts">
import ButtonBase from '@renderer/components/ui/Button/ButtonBase.vue';
import { RouterLinkProps } from 'vue-router/auto';

const props = defineProps<{ to?: RouterLinkProps['to'] }>();
</script>

<template>
  <ButtonBase class="link-button" :to="props.to"><slot /></ButtonBase>
</template>

<style scoped lang="postcss">
.link-button {
  border-image: none;
  border-color: transparent;
  transition: border-color var(--duration-2), color var(--duration-2);
  box-shadow: none;

  &::after {
    display: none;
  }

  &:hover,
  &:focus-visible {
    box-shadow: none;
    border-bottom-color: currentColor;
  }

  &:focus-visible {
    color: var(--color-accent);
  }

  &.router-link-active {
    color: var(--color-primary);
  }
}
</style>
