import { httpService } from '@dotz/shared/dist/client';
import type { ApiRouter } from '@dotz/server';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpcClient = createTRPCProxyClient<ApiRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: import.meta.env.PUBLIC_API_URL,
      fetch: httpService.trpcFetch
    })
  ]
});
