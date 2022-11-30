<script setup lang="ts">
import { RouterLink, RouterLinkProps } from 'vue-router/auto';

const props = defineProps<{ to?: RouterLinkProps['to'] }>();
const attrs = useAttrs();

const is = computed(() => {
  if (props.to) return RouterLink;
  if (attrs.href) return 'a';

  return 'button';
});
</script>

<template>
  <component :is="is" :to="props.to" class="button-base">
    <span>
      <slot />
    </span>
  </component>
</template>

<style lang="postcss">
.button-base {
  display: inline-flex;
  background-color: var(--color-primary-half);
  color: var(--color-on-primary);
  border-radius: var(--radius-pill);
  font-weight: 700;
  overflow: hidden;
  cursor: pointer;
  border: solid 2px var(--color-primary-light);
  backdrop-filter: blur(0.5rem);
  text-shadow: none;

  & > span {
    position: relative;
    width: 100%;
    z-index: 1;
    padding: var(--space-3) var(--space-5);
  }

  & > span::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 50%;
    background: linear-gradient(to left, var(--color-primary), transparent);
    transform: skewX(45deg);
    transition: transform var(--duration-2);
    z-index: -1;
  }

  &:hover,
  &:focus-visible {
    filter: contrast(130%);

    &::after {
      transform: scale(2.5);
    }

    & > span::after {
      transform: skewX(-45deg);
    }
  }
}
</style>
