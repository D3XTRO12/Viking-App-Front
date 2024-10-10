import React, { useState, useEffect } from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Card, IconButton } from 'react-native-paper';
import api from '../components/axios/Axios';

import styles from '../components/styles/Styles';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../components/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/navigation/Types';
import axios from 'axios';
import ConfirmButton from '../components/buttons/ConfirmButton';
import { FlashList } from '@shopify/flash-list';

interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

const Login: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log(`Autenticación exitosa. Email del usuario: ${user.email}`);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });

      if (response.data && response.data.accessToken) {
        const { accessToken, tokenType } = response.data;
        console.log('Autenticación exitosa');
        await SecureStore.setItemAsync('token', accessToken);
        await login({ accessToken, tokenType });
      } else {
        throw new Error('Respuesta del servidor no válida');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      if (axios.isAxiosError(error)) {
        // Manejo de errores con Axios
      } else if (error instanceof Error) {
        console.error(`Ocurrió un error durante el login: ${error.message}`);
      } else {
        console.error('Ocurrió un error desconocido durante el login');
      }
    }
  };

  const renderItem = () => (
    <>
      <Image 
        source={require('../images/icons/LOGO.png')}
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Card style={styles.card}>
      <Card.Content>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <View style={styles.passwordInputContainer}>
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1 }]}
          />
          <IconButton
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          />
        </View>
        <ConfirmButton 
          title={isLoading ? 'Cargando...' : 'Iniciar Sesión'} 
          onPress={handleLogin} 
        />
        {user && (
          <Text style={styles.userInfo}>Usuario autenticado: {user.email}</Text>
        )}
      </Card.Content>
    </Card>
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // Ajusta según sea necesario
    >
      
      <FlashList
        data={[{}]} // Usamos un array con un solo objeto para renderizar un solo elemento
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Genera un key único
        estimatedItemSize={200} // Ajusta según el tamaño de tu contenido
      />
    </KeyboardAvoidingView>
  );
};

export default Login;
