import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../components/context/AuthContext';
import AddWorkOrder from '../../screens/AddWorkOrder';
import AddDiagnosticPoint from '../../screens/AddDiagnosticPoint';
import HandleUsers from '../../screens/Users/HandleUsers';
import AddDevice from '../../screens/AddDevice';
import { PrivateTabParamList, RootStackParamList } from './Types';

const PrivateTab = createBottomTabNavigator<PrivateTabParamList>();

const PrivateTabs = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('PublicTabs');
    }
  }, [isAuthenticated, navigation]);

  const handleLogout = async () => {
    await logout();
  };


  return (
    <PrivateTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'HandleUsers':
              iconName = 'person-add';
              break;
            case 'AddDevice':
              iconName = 'hardware-chip';
              break;
            case 'AddWorkOrder':
              iconName = 'add-circle';
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
        name="HandleUsers" 
        component={HandleUsers} 
        options={{ 
          tabBarLabel: 'Usuarios', // Cambia el nombre aquí
          title: 'Gestion de Usuarios' // Cambia el título aquí
        }} 
      />
      <PrivateTab.Screen 
        name="AddDevice" 
        component={AddDevice} 
        options={{ 
          tabBarLabel: 'Agregar Dispositivo', // Cambia el nombre aquí
          title: 'Agregar Nuevo Dispositivo' // Cambia el título aquí
        }} 
      />
      <PrivateTab.Screen 
        name="AddWorkOrder" 
        component={AddWorkOrder} 
        options={{ 
          tabBarLabel: 'Agregar Orden de Trabajo', // Cambia el nombre aquí
          title: 'Agregar Nueva Orden de Trabajo' // Cambia el título aquí
        }} 
      />
      <PrivateTab.Screen 
        name="AddDiagnosticPoint" 
        component={AddDiagnosticPoint} 
        options={{ 
          tabBarLabel: 'Agregar Punto de Diagnóstico', // Cambia el nombre aquí
          title: 'Agregar Nuevo Punto de Diagnóstico' // Cambia el título aquí
        }} 
      />
    </PrivateTab.Navigator>
  );
};

export default PrivateTabs;

