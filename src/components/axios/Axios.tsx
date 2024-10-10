import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Añade un timeout de 10 segundos
});

// Función para establecer el token de autenticación
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Añade un interceptor de solicitud
api.interceptors.request.use(
  async (config) => {
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

// Añade un interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      Alert.alert('Error', 'No se recibió respuesta del servidor');
    } else {
      Alert.alert('Error', 'Ocurrió un error al realizar la solicitud');
    return Promise.reject(error);
  }}
);

export default api;