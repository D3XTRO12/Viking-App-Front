import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de solicitud mejorado
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Log para debugging
        console.warn('No token found in SecureStore');
      }
      return config;
    } catch (error) {
      console.error('Error accessing SecureStore:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta mejorado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Token expirado o inválido
        try {
          await SecureStore.deleteItemAsync('token');
          // Aquí podrías redirigir al login
          Alert.alert('Sesión expirada', 'Por favor, vuelva a iniciar sesión');
        } catch (e) {
          console.error('Error clearing token:', e);
        }
      }
      
      Alert.alert('Error', error.response.data?.message || 'Error en la solicitud');
    } else if (error.request) {
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    } else {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
    
    return Promise.reject(error);
  }
);

// Funciones auxiliares para manejar el token
export const tokenService = {
  async setToken(token: string) {
    try {
      await SecureStore.setItemAsync('token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
  
  async getToken() {
    try {
      return await SecureStore.getItemAsync('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

export default api;