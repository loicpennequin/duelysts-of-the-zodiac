import { AnyFunction, Nullable } from '@dotz/shared';
import { config } from '../config';

export const handleCORS = (origin: Nullable<string>, callback: AnyFunction) => {
  if (!origin) callback(null, true);
  else if (config.CORS.ALLOWED_ORIGINS.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('CORS yo ass baby'));
  }
};
