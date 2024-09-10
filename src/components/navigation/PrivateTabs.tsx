import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AddWorkOrder from '../../screens/AddWorkOrder';
import AddDiagnosticPoint from '../../screens/AddDiagnosticPoint';
import AddClients from '../../screens/AddClients';
import AddDevice from '../../screens/AddDevice';
import { RootStackParamList } from '../../../App';
type PrivateTabParamList = {
  AddWorkOrder: undefined;
  AddDiagnosticPoint: undefined;
  AddClients: undefined;
  AddDevice: undefined;
};

const PrivateTab = createBottomTabNavigator<PrivateTabParamList>();

const PrivateTabs = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <PrivateTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'AddClients':
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
      <PrivateTab.Screen name="AddClients" component={AddClients} />
      <PrivateTab.Screen name="AddDevice" component={AddDevice} />
      <PrivateTab.Screen name="AddWorkOrder" component={AddWorkOrder} />
      <PrivateTab.Screen name="AddDiagnosticPoint" component={AddDiagnosticPoint} />
    </PrivateTab.Navigator>
  );
};

export default PrivateTabs;