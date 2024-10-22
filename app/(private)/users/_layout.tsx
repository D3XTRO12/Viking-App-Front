import React from 'react';
import { Stack } from 'expo-router';

export default function UsersLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Usuarios',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Crear Usuario',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[id]/edit" 
        options={{ 
          title: 'Editar Usuario',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}