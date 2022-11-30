<script setup lang="ts">
import { Nullable } from '@dotz/shared';

type Props = {
  modelValue: Nullable<string>;
  name?: string;
  type?: string;
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
const slots = useSlots();
</script>

<template>
  <div class="text-input">
    <div v-if="slots.left">
      <slot name="left" />
    </div>
    <input
      :id="props.id"
      v-model="vModel"
      :name="props.name"
      :type="props.type"
    />
    <div v-if="slots.right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.text-input {
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  overflow: hidden;
  border: solid 1px var(--color-primary-light);
  transition: background-color var(--duration-1);

  &:focus-within {
    border-color: var(--color-accent);
    background-color: var(--color-surface);
  }

  & > input {
    flex: 1;
    padding: var(--space-2) var(--space-3);
    min-width: 0;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px var(--color-surface) inset !important;
      text-shadow: none;
    }
  }
}
</style>
