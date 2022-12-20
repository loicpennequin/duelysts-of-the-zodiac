export const useStopwatch = () => {
  const counterInSeconds = ref(0);
  const formatedCounter = computed(() => {
    const minutes = Math.round(counterInSeconds.value / 60);
    const seconds = counterInSeconds.value % 60;

    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(
      2,
      '0'
    )}`;
  });

  const { pause, resume } = useIntervalFn(
    () => {
      counterInSeconds.value++;
    },
    1000,
    { immediate: false }
  );

  const reset = () => {
    pause();
    counterInSeconds.value = 0;
  };

  return { counterInSeconds, formatedCounter, pause, resume, reset };
};
