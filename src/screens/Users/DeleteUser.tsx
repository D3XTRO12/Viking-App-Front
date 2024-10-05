import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import api from '../../components/axios/Axios';
import styles from '../../components/styles/Styles';

const DeleteUser: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [dni, setDni] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/api/user/search?query=by-dni&dni=${dni}`);
      if (response.data) {
        // Asumiendo que el response.data es un objeto que contiene la información del usuario
        setUserId(response.data.id); // Almacena el ID del usuario encontrado
        Alert.alert('Usuario encontrado', `Nombre: ${response.data.name}`);
      } else {
        Alert.alert('No encontrado', 'No se encontró un usuario con ese DNI.');
        setUserId(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda del usuario');
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      Alert.alert('Error', 'Por favor busca un usuario antes de intentar eliminarlo.');
      return;
    }

    try {
      const response = await api.delete(`/api/user/delete/${userId}`);
      if (response.status === 204) {
        Alert.alert('Éxito', 'Usuario eliminado correctamente');
        setDni('');
        setUserId(null); // Reinicia el estado después de eliminar
      } else {
        Alert.alert('Error', 'No se pudo eliminar el usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al intentar eliminar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eliminar Usuario</Text>

      <TextInput
        style={styles.input}
        value={dni}
        onChangeText={setDni}
        placeholder="Ingrese el DNI del usuario"
      />

      <TouchableOpacity onPress={handleSearch} style={styles.backButton}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {userId && (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Eliminar Usuario</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteUser;
