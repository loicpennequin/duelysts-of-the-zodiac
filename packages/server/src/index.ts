import dotenv from 'dotenv';
dotenv.config({ path: `.env.local` });

import express from 'express';
import http from 'http';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import { router } from './core/router';
import { userRouter } from './user/userRouter';
import { authRouter } from './auth/authRouter';
import { config } from './config';
import { createApiContext } from './core/createContext';
import { handleCORS } from './core/cors';
import { initIO } from './core/io';
import { matchmakingRouter } from './matchmaking/matchmakingRouter';
import { gameRouter } from './game/gameRouter';

export const apiRouter = router({
  user: userRouter,
  auth: authRouter,
  matchmaking: matchmakingRouter,
  game: gameRouter
});

export type ApiRouter = typeof apiRouter;

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
} else {
  app.use(
    cors({
      credentials: true,
      origin: handleCORS
    })
  );
}

app.use(cookieParser(config.SESSION.SECRET));
app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext: ({ req, res }) => createApiContext({ req, res }),
    onError({ error, path, input }) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('[ ERROR ]'), '-', path, '-', error.message);
      if (input) {
        console.log('input :', input);
      }
    }
  })
);

initIO(server);

server.listen(process.env.port || 4000, () => {
  console.log('server ready');
});
