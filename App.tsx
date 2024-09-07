import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import WorkOrders from './src/screens/WorkOrder';
import AddWorkOrder from './src/screens/AddWorkOrder';
import AddDiagnosticPoint from './src/screens/AddDiagnosticPoint';
import AddClients from './src/screens/AddClients';
import AddDevice from './src/screens/AddDevice';

export type RootTabParamList = {
  Home: undefined;
  WorkOrders: undefined;
  AddWorkOrder: undefined;
  AddDiagnosticPoint: undefined;
  AddClients: undefined;
  AddDevice: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'WorkOrders':
                iconName = 'briefcase';
                break;
              case 'AddWorkOrder':
                iconName = 'add-circle';
                break;
              case 'AddDiagnosticPoint':
                iconName = 'medical';
                break;
              case 'AddClients':
                iconName = 'person-add';
                break;
              case 'AddDevice':
                iconName = 'hardware-chip';
                break;
              default:
                iconName = 'ellipse';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="AddClients" component={AddClients} />
        <Tab.Screen name="AddDevice" component={AddDevice} />
        <Tab.Screen name="AddWorkOrder" component={AddWorkOrder} />
        <Tab.Screen name="AddDiagnosticPoint" component={AddDiagnosticPoint} />
        <Tab.Screen name="WorkOrders" component={WorkOrders} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}