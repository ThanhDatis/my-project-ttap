import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
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

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error('Failed to get auth token', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

function showToast(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
): void {
  import('../components/toastMessage')
    .then(({ ToastMessage }) => {
      ToastMessage(type, message);
    })
    .catch(() => {
      console.log(`${type.toUpperCase()}: ${message}`);
    });
}

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (import.meta.env.DEV) {
//       console.log(`${config.method?.toUpperCase()} ${config.url}`, config.data);
//     }
//     return config;
//   },
//   (error) => {
//     console.log('Request error:', error);
//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        showToast('error', 'Session expired. Please login again.');
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth/signin';
        break;
      case 403:
        console.log('Access forbidden');
        break;
      case 500:
        console.log('Server error');
        break;
      default:
        if (error.message === 'Network Error') {
          console.log('Network error');
        }
        break;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
