import { LoginDto, Nullable } from '@dotz/shared';
import { httpService } from '@dotz/shared';
import { trpcClient } from '@renderer/trpc';
import { REMEMBER_ME_LOCAL_STORAGE } from '@renderer/utils/constants';
import jwtDecode from 'jwt-decode';

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

const REFRESH_ENDPOINT = '/api/auth.refreshToken';
const AUTH_HEADER = 'Authorization';

const getBearer = () => `Bearer ${token}`;
let token: Nullable<string> = null;

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

const handleRefreshToken = () => {
  // keeping track of the refresh promise for deduping
  // We don't want multiple request firing at the same time triggzring multiple refreshes
  let ongoingRefreshPromise: Nullable<Promise<void>>;

  const checkJwtExpiration = (jwt: string) => {
    const { exp } = jwtDecode<JwtPayload>(jwt);
    const now = new Date();
    const expirationDate = new Date(exp * 1000); // exp is in seconds

    return now.getTime() > expirationDate.getTime();
  };

  const refreshJwtIfNeeded = async () => {
    if (!token) return;

    const isExpired = checkJwtExpiration(token);
    if (!isExpired) return;
    token = null;
    const { accessToken } = await trpcClient.auth.refreshToken.mutate();
    token = accessToken;
  };

  httpService.onRequest(async config => {
    if (config.request.toString().includes(REFRESH_ENDPOINT)) return;

    if (!ongoingRefreshPromise) {
      ongoingRefreshPromise = refreshJwtIfNeeded();
    }

    await ongoingRefreshPromise;
    ongoingRefreshPromise = null;
  });
};

export const authService = {
  init() {
    handleRefreshToken();
    addHeaders();
    const rememberMe = localStorage.getItem(REMEMBER_ME_LOCAL_STORAGE);
    return rememberMe ? authService.refreshJwt() : Promise.resolve();
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
