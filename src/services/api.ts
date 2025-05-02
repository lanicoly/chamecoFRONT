import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chamecoapi.pythonanywhere.com/',
    headers: {
        'Content-Type': 'Application/json',
    },
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        const method = config.method?.toLowerCase();

        if (method === "get"){
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

export default api;