import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Cambiado aquí
import { useAuth } from '../../src/components/context/AuthContext';
import api from '../axios/Axios';
import LoadingIndicator from '../../src/components/styles/LoadingIndicator';

export default function PrivateLayout() {
  const { isAuthenticated, logout, getToken } = useAuth();
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      checkUserRole();
    }
  }, [isAuthenticated]);

  const checkUserRole = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      if (!token) {
        console.error('No se encontró token de autenticación');
        setIsStaff(false);
        setUserId(null);
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        const roleResponse = await api.get<boolean>('/api/user-roles/is-staff', { headers });
        const userResponse = await api.get('/api/user/current', { headers });
  
        if (roleResponse?.data !== undefined) {
          setIsStaff(roleResponse.data);
        } else {
          console.warn('No se recibieron datos del rol');
          setIsStaff(false);
        }
  
        if (userResponse?.data?.id) {
          setUserId(userResponse.data.id);
        } else {
          console.warn('No se recibieron datos del usuario');
          setUserId(null);
        }
      } catch (apiError) {
        console.error('Error en las llamadas a la API:', apiError);
        setIsStaff(false);
        setUserId(null);
      }
  
    } catch (error) {
      console.error('Error general en checkUserRole:', error);
      setIsStaff(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(public)');
  };

  if (!isAuthenticated || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap; // Tipado correcto para los iconos
          switch (route.name) {
            case 'work-orders':
              iconName = 'briefcase';
              break;
            case 'users':
              iconName = 'person-add';
              break;
            case 'devices/index':
              iconName = 'hardware-chip';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerRight: () => (
          <Ionicons
            name="log-out"
            size={24}
            color="black"
            onPress={handleLogout}
            style={{ marginRight: 15 }}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="work-orders"
        options={{
          tabBarLabel: 'Órdenes de Trabajo',
          title: 'Órdenes de Trabajo',
        }}
      />
      {isStaff && (
        <Tabs.Screen
          name="users"
          options={{
            tabBarLabel: 'Usuarios',
            title: 'Gestión de Usuarios',
          }}
        />
      )}
      {isStaff && (
        <Tabs.Screen
          name="devices/index"
          options={{
            tabBarLabel: 'Dispositivos',
            title: 'Agregar Dispositivos',
          }}
        />
      )}
    </Tabs>
  );
}