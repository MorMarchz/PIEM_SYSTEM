import axios from 'axios';

// Create configured Axios Instance
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Allow HTTP-Only refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessTokenMemory = null;

export const setAccessTokenInMemory = (token) => {
  accessTokenMemory = token;
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const getAccessTokenFromMemory = () => {
  return accessTokenMemory || localStorage.getItem('access_token');
};

// Request Interceptor: Attach Access Token to Headers
api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromMemory();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized & Silent Token Refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh via HTTP-Only cookie endpoint
        const response = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = response.data?.data?.access_token;

        if (newAccessToken) {
          setAccessTokenInMemory(newAccessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessTokenInMemory(null);
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
