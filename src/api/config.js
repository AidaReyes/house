import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers['x-token'] = bearerToken;
      config.headers['authorization'] = bearerToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// RESPONSE
export const attachInterceptors = (logout) => {

  api.interceptors.response.use(

    (res) => res,

    (error) => {

      const status = error?.response?.status;
      const message = error?.response?.data?.message?.toLowerCase() || "";

      if (status === 401 || message.includes("expired")) {

        // Lanzar evento global
        window.dispatchEvent(
          new CustomEvent("session-expired", {
            detail: {
              message: "Tu sesión ha expirado. Inicia sesión nuevamente."
            }
          })
        );

        logout();
      }

      return Promise.reject(error);
    }

  );

};

export default api;