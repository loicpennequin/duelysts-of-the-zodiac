<script setup lang="ts">
const LAYERS_COUNT = 26;
const CLIP_STEP = 5;

const getClipPath = (index: number) => {
  const steps = [
    `${-30 + index * CLIP_STEP}% 0`,
    `${-20 + index * CLIP_STEP}% 0`,
    `${20 + index * CLIP_STEP}% 100%`,
    `${0 + index * CLIP_STEP}% 100%`
  ];

  return `
  polygon(
    ${steps.join(', ')}
  )`;
};

const getDelay = (i: number) => `${i * 200 - 10000}ms`;
</script>

<template>
  <div
    class="app-title animate__animated animate__backInDown"
    aria-label="Duelysts of the Zodiac"
  >
    <div
      v-for="i in LAYERS_COUNT"
      :key="i"
      aria-hidden="true"
      :style="{ '--clip-path': getClipPath(i), '--delay': getDelay(i) }"
    >
      Duelysts
      <span>Of The</span>
      <span>Zodiac</span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.app-title {
  --size: var(--text-size-8);

  position: relative;
  margin-inline: auto;
  max-width: 80%;
  text-align: center;
  display: grid;

  & > div {
    will-change: transform;
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    mix-blend-mode: soft-light;
    font-size: var(--size);
    clip-path: var(--clip-path);
    animation: shine 2500ms var(--delay) ease-in-out infinite alternate;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    & > span:nth-of-type(1) {
      margin-bottom: -10px; /* makes it look more aligned */
      font-size: 0.4em;
      font-weight: 400;
    }

    & > span:nth-of-type(2) {
      filter: hue-rotate(125deg);
    }
  }
}

@keyframes shine {
  0% {
    scale: 1.05;
    color: var(--color-primary-quarter);
  }
  100% {
    scale: 1;
    color: var(--color-primary-light);
  }
}
</style>
