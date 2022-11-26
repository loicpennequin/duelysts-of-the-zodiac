import type { ApiConfig } from './types';

let config: ApiConfig;

export const setConfig = (c: ApiConfig) => {
  config = c;
};
export const getConfig = () => config;
