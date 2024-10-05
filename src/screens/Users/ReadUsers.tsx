import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../components/styles/Styles';
import api from '../../components/axios/Axios';
import SearchButton from '../../components/buttons/SearchButton';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dni: string;
  // Añade aquí otros campos que pueda tener un usuario
}

interface ReadUsersProps {
  onBack: () => void;
}

const ReadUsers: React.FC<ReadUsersProps> = ({ onBack }) => {
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async () => {
    try {
      let endpoint = `/api/user/search?query=${searchType}`;
      if (searchType !== 'all' && searchQuery) {
        endpoint += `&${searchType.replace('by-', '')}=${searchQuery}`;
      }
      const response = await api.get(endpoint);
      setUsers(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron buscar los usuarios');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Usuarios</Text>
      
      <Picker
        selectedValue={searchType}
        onValueChange={(itemValue) => setSearchType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Todos" value="all" />
        <Picker.Item label="Por Email" value="by-email" />
        <Picker.Item label="Por DNI" value="by-dni" />
      </Picker>

      {searchType !== 'all' && (
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Ingrese el término de búsqueda"
        />
      )}

      <SearchButton title="Buscar" onPress={handleSearch} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>Nombre: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>DNI: {item.dni}</Text>
            <Text>Numero de Telefono: {item.phoneNumber}</Text>
          </View>
        )}
      />

    <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Volver</Text>
    </TouchableOpacity>

    </View>
  );
};

export default ReadUsers;