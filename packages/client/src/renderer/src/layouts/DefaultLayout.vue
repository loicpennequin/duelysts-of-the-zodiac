<script setup lang="ts">
import OngoingGameModal from '@renderer/components/OngoingGameModal.vue';
import AppHeader from '@renderer/components/AppHeader/index.vue';
</script>

<template>
  <OngoingGameModal />

  <div class="default-layout">
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="postcss">
.default-layout {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>
