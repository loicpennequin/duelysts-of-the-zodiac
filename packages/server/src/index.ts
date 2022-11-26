import express from 'express';
import http from 'http';
import * as trpcExpress from '@trpc/server/adapters/express';
import { apiRouter, createApiContext } from '@dotz/api';
import cors from 'cors';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createConfig } from './config';

dotenv.config({ path: `.env.local` });
const config = createConfig();

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
} else {
  app.use(
    cors({
      origin: config.CORS.ALLOWED_ORIGINS
    })
  );
}

app.use(cookieParser(config.SESSION.SECRET));
app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext: ({ req, res }) => ({ req, res, config }),
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
