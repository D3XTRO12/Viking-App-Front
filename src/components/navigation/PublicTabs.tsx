import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../../screens/Home';
import WorkOrders from '../../screens/WorkOrder';
import Login from '../../screens/Login';

export type PublicTabParamList = {
  Home: undefined;
  WorkOrders: undefined;
  Login: undefined;
};

const PublicTab = createBottomTabNavigator<PublicTabParamList>();

const PublicTabs = () => {
  return (
    <PublicTab.Navigator
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
            case 'Login':
              iconName = 'log-in';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <PublicTab.Screen name="Home" component={Home} />
      <PublicTab.Screen name="WorkOrders" component={WorkOrders} />
      <PublicTab.Screen name="Login" component={Login} />
    </PublicTab.Navigator>
  );
};

export default PublicTabs;