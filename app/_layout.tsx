import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/components/context/AuthContext'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Importar react-query

// Crear instancia de QueryClient
const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}> 
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
