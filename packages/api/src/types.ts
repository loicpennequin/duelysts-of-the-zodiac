export type ApiConfig = {
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
