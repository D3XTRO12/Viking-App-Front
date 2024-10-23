import React, { useState, useEffect } from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Card, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../axios/Axios';
import styles from '../../src/components/styles/Styles';
import { useAuth } from '../../src/components/context/AuthContext';
import axios from 'axios';
import ConfirmButton from '../../src/components/buttons/ConfirmButton';
import { FlashList } from '@shopify/flash-list';

interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading, user, validateToken } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await validateToken();

      // Solo redirigir si el usuario está autenticado y no está cargando
      if (!isLoading && isAuthenticated && user) {
        console.log(`Usuario ya autenticado. Email: ${user.email}`);
        router.replace('/(private)/work-orders');
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, user, isLoading, validateToken, router]);

  const handleLogin = async () => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
    
      if (response?.data && response.data.accessToken) {
        const { accessToken, tokenType } = response.data;
        await login({ accessToken, tokenType });
        await validateToken();
  
        // Redirigir después del inicio de sesión
        router.replace('/(private)/work-orders');
      } else {
        throw new Error('Respuesta del servidor no válida');
      }
    } catch (error) {  
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error durante el login');
      } else if (error instanceof Error) {
       Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ocurrió un error durante el login');
      }
    }
  };
  
  

  const renderItem = () => (
    <>
      <Image 
        source={require('../../src/images/icons/LOGO.png')}
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
      keyboardVerticalOffset={100}
    >
      <FlashList
        data={[{}]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={200}
      />
    </KeyboardAvoidingView>
  );
};

export default Login;
