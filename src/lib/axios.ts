import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
// import { create } from 'zustand';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function getAuthToken() {
  return localStorage.getItem('token');
}
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        //Add toastMessage
        localStorage.removeItem('token');
        window.location.href = '/signin';
        break;
      case 403:
        //Add toastMessage
        break;
      case 400:
        //Add toastMessage
        break;
      case 500:
        //Add toastMessage
        break;
      default:
        if (error.message === 'Network Error') {
          alert('Not connect');
        }
        break;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
