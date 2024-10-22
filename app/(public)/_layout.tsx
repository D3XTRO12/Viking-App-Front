import React from 'react';
import { Tabs } from 'expo-router';

const PublicLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="login" options={{ title: "Iniciar Sesion" }} />

    </Tabs>
  );
};

export default PublicLayout;
