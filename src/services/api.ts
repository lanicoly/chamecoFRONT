import axios, { isAxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'Application/json',
    },
    timeout: 5000,
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");

      if (token) {
        const method = config.method?.toLowerCase();

        if (method === "get" || method === "delete") {
            config.params = {
                ...(config.params || {}),
                token: token,
            };
        } else if (method === "post" || method === "put") {
            if (typeof config.data === "object" && config.data !== null) {
                config.data = {
                    ...config.data,
                    token: token,
                };
            } else {
                config.data = { token: token };
            }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userType");
                window.location.replace("/")
            }
        }
        return Promise.reject(error);
    }
)

export default api;