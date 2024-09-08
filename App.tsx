// App.tsx
import PublicTabs from './src/components/navigation/PublicTabs';
import PrivateTabs from './src/components/navigation/PrivateTabs';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/components/context/AuthContext';

export type RootStackParamList = {
  PublicTabs: undefined;
  PrivateTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user == null ? (
          <Stack.Screen name="PublicTabs" component={PublicTabs} />
        ) : (
          <Stack.Screen name="PrivateTabs" component={PrivateTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

export default App;