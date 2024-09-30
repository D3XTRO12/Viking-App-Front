import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const api = axios.create({
  baseURL: 'http://172.28.205.8:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Añade un interceptor de solicitud
api.interceptors.request.use(
    async (config) => {
      // Obtén el token del almacenamiento seguro
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  export default api;