import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import api from '../axios/Axios'; // Asegúrate de que la ruta sea correcta
type TokenResponse = {
  accessToken: string;
  tokenType: string;
};

type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
};

type User = {
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (tokenResponse: TokenResponse) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const decodeToken = (token: string): DecodedToken => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      throw error;
    }
  };
  
  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        return false;
      }
  
      const decoded = decodeToken(token);
      if (Date.now() >= decoded.exp * 1000) {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
        return false;
      }
  
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data === true) {
        // El token es válido, actualizar el estado del usuario
        setUser({ email: decoded.sub, token });
        return true;
      } else {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
        return false;
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
      setUser(null);
      return false;
    }
  }, []);
  
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        await validateToken();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [validateToken]);

  const login = async (tokenResponse: TokenResponse) => {
    setIsLoading(true);
    try {
      const { accessToken } = tokenResponse;
      await SecureStore.setItemAsync('token', accessToken);
      const isValid = await validateToken();
      if (!isValid) {
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('token');
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const isValid = await validateToken();
        return isValid ? token : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    getToken,
    validateToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};