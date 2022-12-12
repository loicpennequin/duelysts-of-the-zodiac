import chalk from 'chalk';
import { createClient } from 'redis';

export const redisClient = createClient({});
redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.on('error', err => console.log(chalk.red('[ REDIS ]'), ' - ', err));
