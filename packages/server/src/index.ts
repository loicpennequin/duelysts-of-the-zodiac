import express from 'express';
import http from 'http';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ApiConfig, apiRouter, createApiContext } from '@dotz/api';
import cors from 'cors';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createConfig } from './config';
import MailDev from 'maildev';

dotenv.config({ path: `.env.local` });
const config = createConfig();

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
} else {
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (!origin) callback(null, true);
        else if (config.CORS.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS yo ass baby'));
        }
      }
    })
  );

  // const maildev = new MailDev({ smtp: 25 });
  // maildev.listen(err => {
  //   if (err) console.error(err);

  //   console.log(chalk.yellow('[MAILDEV]'), ' - ', 'ready at endpoint /maildev');
  // });
}

app.use(cookieParser(config.SESSION.SECRET));
app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext: ({ req, res }) =>
      createApiContext({ req, res, config: config as ApiConfig }),
    onError({ error, path, input }) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('[ ERROR ]'), '-', path, '-', error.message);
      if (input) {
        console.log('input :', input);
      }
    }
  })
);
app.use('/', (req, res) => res.send('hello'));

server.listen(process.env.port || 4000, () => {
  console.log('server ready');
});
