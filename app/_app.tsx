import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../src/components/context/AuthContext';
import LoadingIndicator from '../src/components/styles/LoadingIndicator';

const AuthHandler = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isInPublicGroup = segments[0] === '(public)';
    
    if (!isAuthenticated && !isInPublicGroup) {
      router.replace('/login'); // Redirige a login si no está autenticado
    } else if (isAuthenticated && isInPublicGroup) {
      router.replace('/(private)/work-orders'); // Redirige al área privada si está autenticado
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return <LoadingIndicator />; // Muestra un indicador de carga mientras se verifica la autenticación
  }

  return <Slot />; // Renderiza las rutas correspondientes
};

export default AuthHandler;
