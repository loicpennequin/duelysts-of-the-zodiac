<script setup lang="ts">
import IconClose from '~icons/mdi/close';
import IconMinimize from '~icons/mdi/minus';
import IconMaximize from '~icons/mdi/checkbox-blank-outline';

const invoke = (event: string, payload?: any) =>
  window.electron.ipcRenderer.invoke(event, payload);
</script>

<template>
  <header class="app-frame">
    <button title="minimize" @click.stop="invoke('minimize')">
      <IconMinimize />
    </button>
    <button title="maximize" @click.stop="invoke('maximize')">
      <IconMaximize />
    </button>
    <button title="close application" @click.stop="invoke('close')">
      <IconClose />
    </button>
  </header>
</template>

<style scoped lang="postcss">
.app-frame {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  position: sticky;
  top: 0;
  padding: var(--space-1);
  border-radius: 0;
  border-color: transparent;
  z-index: 99999;
  user-select: none;
  -webkit-app-region: drag;
}

button {
  font-size: var(--text-size-3);
  -webkit-app-region: no-drag;

  &:hover,
  &:focus {
    color: var(--color-accent);
  }
}
</style>
