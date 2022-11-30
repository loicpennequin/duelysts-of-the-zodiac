<script setup lang="ts">
import IconCheckMark from '~icons/game-icons/check-mark';

type Props = {
  modelValue: boolean;
  name?: string;
  id: string;
  disabled?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  name: undefined
});
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const vModel = useVModel(props, 'modelValue', emit);
</script>

<template>
  <label :for="props.id" class="checkbox">
    <input
      :id="props.id"
      v-model="vModel"
      :name="props.name"
      type="checkbox"
      class="sr-only"
    />
    <div class="inner">
      <transition leave-active-class="animate__animated animate__fadeOut">
        <IconCheckMark
          v-if="props.modelValue"
          class="animate__animated animate__fadeIn"
          style="--animate-duration: var(--duration-1)"
        />
      </transition>
    </div>
    <slot />
  </label>
</template>

<style scoped lang="postcss">
.checkbox {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
}
.inner {
  border: solid 1px var(--color-primary-light);
  height: 1em;
  aspect-ratio: 1;
  cursor: pointer;

  & > svg {
    height: 100%;
    width: 100%;
  }
}

input:focus ~ .inner {
  border-color: var(--color-accent);
}
</style>
