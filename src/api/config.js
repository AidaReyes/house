import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ========== REQUEST INTERCEPTOR ==========
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Puedes usar Authorization también
      // config.headers['Authorization'] = `Bearer ${token}`;

      config.headers['x-token'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== RESPONSE INTERCEPTOR ==========
export const attachInterceptors = (logoutWithAlert) => {
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message?.toLowerCase() || "";

      if (status === 401 || message.includes("expired")) {
        logoutWithAlert("Tu sesión ha expirado. Inicia sesión nuevamente.");
      }

      return Promise.reject(error);
    }
  );
};


export default api;
