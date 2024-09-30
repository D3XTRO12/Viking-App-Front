import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import api from '../components/axios/Axios'; // Importa el nuevo archivo Axios.tsx
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../components/context/AuthContext'; // Importa el contexto de autenticación
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/navigation/Types'; // O donde tengas definido tu stack

interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

const Login: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Añade la navegación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response && response.status === 200) {
        const authData: AuthResponse = response.data;
        
        // Asegúrate de que el token sea una cadena
        const token = authData.accessToken;
        if (typeof token !== 'string') {
          throw new Error('El token recibido no es una cadena válida');
        }
  
        // Guarda el token como una cadena
        await SecureStore.setItemAsync('token', token);
        
        // Llama a la función login del contexto de autenticación
        await login({ email, token });
        
        Alert.alert('Éxito', 'Iniciaste sesión correctamente');
      } else if (response && response.status >= 400) {
        Alert.alert('Error', 'Credenciales inválidas');
        console.error('Credenciales inválidas:', response.data);
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado');
        console.error('Respuesta inesperada:', response);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      if (error instanceof Error) {
        Alert.alert('Error', `Ocurrió un error durante el login: ${error.message}`);
      } else {
        Alert.alert('Error', 'Ocurrió un error desconocido durante el login');
      }
    }
  };  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;
