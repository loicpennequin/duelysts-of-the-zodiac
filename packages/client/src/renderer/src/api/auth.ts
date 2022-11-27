import { LoginDto, Nullable } from '@dotz/shared';
import { httpService } from '@dotz/shared/dist/client';
import { trpcClient } from '@renderer/trpc';

let token: Nullable<string> = null;

const getBearer = () => `Bearer ${token}`;
const AUTH_HEADER = 'Authorization';

const addHeaders = () => {
  httpService.onRequest(config => {
    if (!token) return;

    if (!config.options.headers) {
      config.options.headers = new Headers();
    }

    if (config.options.headers instanceof Headers) {
      config.options.headers.set(AUTH_HEADER, getBearer());
    } else {
      config.options.headers[AUTH_HEADER] = getBearer();
    }
  });
};

export const authService = {
  init() {
    addHeaders();
  },

  async login(data: LoginDto) {
    const { accessToken } = await trpcClient.auth.login.mutate(data);
    token = accessToken;
    return accessToken;
  },

  async logout() {
    const result = await trpcClient.auth.logout.mutate();
    token = null;
    return result;
  },

  async refreshJwt() {
    const { accessToken } = await trpcClient.auth.refreshToken.mutate();
    token = accessToken;
    return accessToken;
  },

  getSession() {
    return trpcClient.auth.session.query();
  }
};
