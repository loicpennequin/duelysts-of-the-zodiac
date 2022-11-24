import express from 'express';
import http from 'http';
import * as trpcExpress from '@trpc/server/adapters/express';
import { apiRouter, createApiContext } from '@dotz/api';

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}
app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext: createApiContext
  })
);

server.listen(process.env.port || 4000, () => {
  console.log('server ready');
});
