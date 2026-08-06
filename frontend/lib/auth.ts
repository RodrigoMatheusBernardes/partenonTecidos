import axios, { AxiosRequestConfig } from 'axios';
import { getApiUrl } from '@/lib/api';

const apiUrl = getApiUrl();

function withSessionCookies(config: AxiosRequestConfig = {}): AxiosRequestConfig {
  return {
    ...config,
    withCredentials: true,
  };
}

async function withRefreshRetry<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await refreshSession();
      return request();
    }
    throw error;
  }
}

export async function authGet<T = any>(path: string, config: AxiosRequestConfig = {}) {
  return withRefreshRetry(() => axios.get<T>(`${apiUrl}${path}`, withSessionCookies(config)));
}

export async function authPost<T = any, D = any>(path: string, data?: D, config: AxiosRequestConfig = {}) {
  return withRefreshRetry(() => axios.post<T>(`${apiUrl}${path}`, data, withSessionCookies(config)));
}

export async function authPut<T = any, D = any>(path: string, data?: D, config: AxiosRequestConfig = {}) {
  return withRefreshRetry(() => axios.put<T>(`${apiUrl}${path}`, data, withSessionCookies(config)));
}

export async function authDelete<T = any>(path: string, config: AxiosRequestConfig = {}) {
  return withRefreshRetry(() => axios.delete<T>(`${apiUrl}${path}`, withSessionCookies(config)));
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const requestConfig: RequestInit = {
    ...init,
    credentials: 'include',
  };

  let response = await fetch(`${apiUrl}${path}`, requestConfig);
  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshSession();
  } catch {
    return response;
  }

  response = await fetch(`${apiUrl}${path}`, requestConfig);
  return response;
}

export async function refreshSession() {
  return axios.post(`${apiUrl}/api/auth/refresh`, {}, {
    withCredentials: true,
  });
}

export async function logoutSession() {
  await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
}

export function setupAuthInterceptors() {
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    return config;
  });
}
