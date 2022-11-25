import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { ApiRouter } from "@dotz/api";

export const trpcClient = createTRPCProxyClient<ApiRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.PUBLIC_API_URL,
    }),
  ],
});
