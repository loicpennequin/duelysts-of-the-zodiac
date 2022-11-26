import express from 'express';
import http from 'http';
import * as trpcExpress from '@trpc/server/adapters/express';
import { apiRouter, createApiContext } from '@dotz/api';
import cors from 'cors';
import chalk from 'chalk';

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}
app.use(
  '/api',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173']
  }),
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext: createApiContext,
    onError({ error, path, input }) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('[ERROR]'), '-', path, '-', error.message);
      console.log(input);
    }
  })
);

server.listen(process.env.port || 4000, () => {
  console.log('server ready');
});
