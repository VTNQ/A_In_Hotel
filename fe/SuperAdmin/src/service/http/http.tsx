import axios from 'axios';
import type {  InternalAxiosRequestConfig } from 'axios';

import { BASE_API } from '../../setting/constant/app';
import { getTokens } from '@/util/auth';

// ✅ Mở rộng AxiosRequestConfig để thêm field skipAuth
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const Http = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
});

Http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getTokens()?.accessToken;

    if (!config.skipAuth && token && token !== 'undefined') {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor cho response
Http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      (error.response.data === 'Token has expired' ||
        error.response.data === 'Invalid JWT token')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default Http;
