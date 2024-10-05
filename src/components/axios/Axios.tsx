import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Función para establecer el token de autenticación
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

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