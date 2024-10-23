import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PublicLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3', // Color cuando está activo
        tabBarInactiveTintColor: 'gray',  // Color cuando está inactivo
        tabBarStyle: {
          height: 60,  // Altura de la barra de tabs
          paddingBottom: 5  // Padding en la parte inferior
        },
        tabBarLabelStyle: {
          fontSize: 12  // Tamaño del texto
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Bienvenido a Viking App",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="login" 
        options={{ 
          title: "Iniciar Sesion",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="login" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
};

export default PublicLayout;