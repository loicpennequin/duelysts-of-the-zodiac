import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { ApiRouter } from "@dotz/api";
import superjson from "superjson";

export const trpcClient = createTRPCProxyClient<ApiRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: import.meta.env.PUBLIC_API_URL,
    }),
  ],
});
