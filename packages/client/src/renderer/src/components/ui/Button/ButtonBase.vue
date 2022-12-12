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
  position: relative;
  font-weight: 700;
  overflow: hidden;
  cursor: pointer;
  box-shadow: inset 0 0 2px #000000;
  text-shadow: none;
  border-image: linear-gradient(
    to bottom,
    var(--color-primary-light),
    var(--color-primary-dark)
  );
  border-image-slice: 1;
  border-width: 2px;
  border-style: solid;
  position: relative;
  display: inline-flex;
  align-items: center;
  transition: box-shadow var(--duration-2);

  &::after {
    content: '';
    position: absolute;
    width: 2rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--color-accent);
    z-index: -1;
    translate: -100% 100%;
    filter: blur(10px);
    bottom: 0;
    transition: scale var(--duration-1), translate var(--duration-1);
  }

  &:hover,
  &:focus-visible {
    /* filter: contrast(130%); */
    box-shadow: inset 0 0 2px #000000,
      0 0.25rem 0.5rem var(--color-primary-half);
    &::after {
      translate: 0 75%;
      scale: 2;
    }
  }

  & > span {
    width: 100%;
    background-color: var(--color-surface);
    padding: var(--space-3) var(--space-5);
  }
}
</style>
