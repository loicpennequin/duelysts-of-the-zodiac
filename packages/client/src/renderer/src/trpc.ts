import { httpService } from "@dotz/shared/dist/client";
import type { ApiRouter } from "@dotz/api";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpcClient = createTRPCProxyClient<ApiRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: import.meta.env.RENDERER_VITE_API_URL,
      fetch: httpService.trpcFetch,
    }),
  ],
});
