import type { Context } from './core/createContext';

export type ApiConfig = {
  WEBSITE_URL: string;

  REFRESH_TOKEN: {
    SECRET: string;
    EXPIRES_IN_SECONDS: number;
    PATH: string;
    HTTPONLY: boolean;
    SECURE: boolean;
    SAMESITE: 'lax' | 'strict' | 'none' | boolean;
  };

  JWT: {
    SECRET: string;
    EXPIRES_IN_SECONDS: number;
  };
};

export type HandlerArgs<T = unknown> = {
  ctx: Context;
  input: T;
};

export type RouterMeta = {
  needsAuth?: boolean;
};

export type EmailTemplate<T extends string> = (
  variables: Record<T, string>
) => {
  subject: string;
  body: string;
};

export type SendMailOptions = {
  to: string;
  template: {
    subject: string;
    body: string;
  };
};

export interface IMailService {
  sendMail: (options: SendMailOptions) => Promise<any>;
}
