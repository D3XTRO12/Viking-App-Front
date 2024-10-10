import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../components/context/AuthContext';
import AddDiagnosticPoint from '../../screens/AddDiagnosticPoint';
import HandleUsers from '../../screens/Users/HandleUsers';
import WorkOrderScreen from '../../screens/WorkOrder';
import AddDevice from '../../screens/AddDevice';
import { PrivateTabParamList, RootStackParamList } from './Types';
import api from '../../components/axios/Axios'; // Asegúrate de que la ruta sea correcta
import { View, StyleSheet } from 'react-native'; // Importa View y StyleSheet
import LoadingIndicator from '../styles/LoadingIndicator';


const PrivateTab = createBottomTabNavigator<PrivateTabParamList>();

type WorkOrderScreenParams = {
  isStaff: boolean;
  userId: string | null;
};

const PrivateTabs = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, isAuthenticated, getToken } = useAuth();
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('PublicTabs');
    } else {
      checkUserRole();
    }
  }, [isAuthenticated, navigation]);

  const checkUserRole = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const [roleResponse, userResponse] = await Promise.all([
        api.get<boolean>('/api/user-roles/is-staff', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/api/user/current', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (roleResponse.data !== undefined) {
        setIsStaff(roleResponse.data);
      } else {
        console.warn('Invalid response for user role');
      }

      if (userResponse.data && userResponse.data.id) {
        setUserId(userResponse.data.id);
      } else {
        console.warn('Invalid response for user ID');
      }
    } catch (error) {
      // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <PrivateTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'WorkOrderScreen':
              iconName = 'briefcase';
              break;
            case 'HandleUsers':
              iconName = 'person-add';
              break;
            case 'AddDevice':
              iconName = 'hardware-chip';
              break;

            case 'AddDiagnosticPoint':
              iconName = 'medical';
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
      <PrivateTab.Screen
        name="WorkOrderScreen"
        component={WorkOrderScreen}
        initialParams={{ isStaff, userId } as WorkOrderScreenParams}
        options={{
          tabBarLabel: 'Órdenes de Trabajo',
          title: 'Órdenes de Trabajo',
        }}
      />
      {isStaff && (
        <>
          <PrivateTab.Screen
            name="HandleUsers"
            component={HandleUsers}
            options={{
              tabBarLabel: 'Usuarios',
              title: 'Gestión de Usuarios',
            }}
          />
          <PrivateTab.Screen
            name="AddDevice"
            component={AddDevice}
            options={{
              tabBarLabel: 'Dispositivos',
              title: 'Agregar Nuevo Dispositivo',
            }}
          />
          <PrivateTab.Screen
            name="AddDiagnosticPoint"
            component={AddDiagnosticPoint}
            options={{
              tabBarLabel: 'Agregar Item',
              title: 'Agregar Diagnostico',
            }}
          />
        </>
      )}
    </PrivateTab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Cambia el color de fondo si es necesario
  },
});

export default PrivateTabs;
