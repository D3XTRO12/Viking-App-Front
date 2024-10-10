import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { Alert } from 'react-native';

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
  getToken: () => Promise<string | null>; // Add this line
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const decodeToken = (token: string): DecodedToken => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          const decoded = decodeToken(storedToken);
          const email = decoded.sub;
          setUser({ email, token: storedToken });
        }
      } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al cargar el usuario');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (tokenResponse: TokenResponse) => {
    setIsLoading(true);
    try {
      const { accessToken } = tokenResponse;
      await SecureStore.setItemAsync('token', accessToken);
      const decoded = decodeToken(accessToken);
      const email = decoded.sub;
      setUser({ email, token: accessToken });
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error durante el login');
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
      Alert.alert('Error', 'Ocurrió un error durante el logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync('token');
      return token;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {

  }, [user]);

  const value: AuthContextType = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    getToken // Add this line
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