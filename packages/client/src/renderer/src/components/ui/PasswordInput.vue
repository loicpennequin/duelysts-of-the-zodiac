<script setup lang="ts">
import { Nullable } from '@dotz/shared';
import IconEye from '~icons/mdi/eye';
import IconEyeOff from '~icons/mdi/eye-off';
import TextInput from './TextInput.vue';

const props = defineProps<{
  name?: string;
  id: string;
  modelValue: Nullable<string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const vModel = useVModel(props, 'modelValue', emit);
const isPasswordShown = ref(false);
const type = computed(() => (isPasswordShown.value ? 'text' : 'password'));
const icon = computed(() => (isPasswordShown.value ? IconEyeOff : IconEye));
</script>

<template>
  <TextInput :id="props.id" v-model="vModel" :name="props.name" :type="type">
    <template #right>
      <button
        class="button"
        type="button"
        :title="isPasswordShown ? 'hide password' : 'show password'"
        @click="isPasswordShown = !isPasswordShown"
      >
        <component :is="icon" />
      </button>
    </template>
  </TextInput>
</template>

<style scoped lang="postcss">
.button {
  height: 100%;
  aspect-ratio: 1;
  padding: var(--space-2);
}

.button:hover,
.button:focus {
  color: var(--color-accent);
}
</style>
