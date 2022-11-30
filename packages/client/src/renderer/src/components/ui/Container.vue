<template>
  <div class="container"><slot /></div>
</template>

<style scoped>
.container {
  --container-size: var(--breakpoints-2xl);
  margin-inline: auto;
  width: 100%;
  max-width: var(--container-size);
}
</style>
