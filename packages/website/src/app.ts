import type { App } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

export default (app: App) => {
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 30_000,
        },
      },
    },
  });
};
