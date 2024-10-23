import React from 'react';
import { Stack } from 'expo-router';

export default function WorkOrdersLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Órdenes de Trabajo',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Agregar Orden de Trabajo',
          presentation: 'modal'
        }} 
      />
    <Stack.Screen
      name="[id]/show-diagnosticPoints"
      options={{
        title: 'Diagnosticos'
      }}
    />
    <Stack.Screen
      name="[id]/add-diagnosticpoint"
      options={{
        title: 'Agregar Diagnostico'
      }}/>
    </Stack>
  );
}