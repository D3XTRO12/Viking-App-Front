import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import SearchButton from '../components/buttons/SearchButton';
import ConfirmButton from '../components/buttons/ConfirmButton';

interface Client {
  id: number;
  dni: string;
  fullName: string;
}

const AddDevice: React.FC = () => {
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [clientDni, setClientDni] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const deviceTypes = [
    'Computadora de Escritorio',
    'Notebook/Netbook',
    'Tablet',
    'Consola de Escritorio',
    'Consola Portátil',
    'Perifericos PC',
    'Joystick',
    'Teléfono',
    'Impresora',
    'Router',
    'Camaras de Seguridad',
    'IoT',
    'Televisores',
    'Otros',
  ];

  const searchClientsByDni = async () => {
    if (!clientDni) {
      Alert.alert('Error', 'Por favor ingresa un DNI.');
      return;
    }
  
    try {
      const response = await axios.get(`http://172.28.205.8:8080/client/search`, {
        params: {
          query: 'by-dni',
          dni: clientDni
        }
      });
  
      console.log('Respuesta de la API:', response.data); // Ver la respuesta
  
      if (response.status === 200) {
        // Verificar si la respuesta es un objeto
        if (response.data && response.data.id) {
          // Convertir el objeto en un array para poder usarlo en FlatList
          setClients([response.data]);
        } else {
          Alert.alert('Error', 'No se encontraron clientes');
          setClients([]);
        }
      }
    } catch (error: any) {
      console.error('Error al buscar clientes por DNI:', error.response || error.message);
      Alert.alert('Error', 'Hubo un problema al buscar los clientes');
      setClients([]);
    }
  };
  
  const handleClientSelect = (item: Client): void => {
    setClientId(item.id); // Guardar el ID del cliente seleccionado
    setClientDni(item.dni); // Opcional: guardar el DNI del cliente seleccionado
    setClients([]); // Limpiar la lista de clientes
    Alert.alert('Cliente seleccionado', `Has seleccionado a ${item.fullName}`);
  };

  const handleSubmit = async () => {
    if (!type || !brand || !model || !serialNumber || !clientId) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const deviceData = {
        type,
        brand,
        model,
        serialNumber,
        client: { id: clientId },
      };

      const response = await axios.post('http://172.28.205.8:8080/device/save', deviceData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Dispositivo agregado correctamente');
        setType('');
        setBrand('');
        setModel('');
        setSerialNumber('');
        setClientDni('');
        setClientId(null);
      } else {
        Alert.alert('Error', 'No se pudo agregar el dispositivo');
      }
    } catch (error) {
      console.error('Error al agregar el dispositivo:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el dispositivo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Dispositivo</Text>

      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar tipo de dispositivo" value="" />
        {deviceTypes.map((deviceType) => (
          <Picker.Item key={deviceType} label={deviceType} value={deviceType} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={brand}
        onChangeText={setBrand}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={model}
        onChangeText={setModel}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Número de Serie"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />
      
      <TextInput
        style={styles.input}
        placeholder="DNI del Cliente"
        value={clientDni}
        onChangeText={setClientDni}
        keyboardType="numeric"
      />
      <SearchButton title="Buscar Cliente" onPress={searchClientsByDni}/>

      {clients.length > 0 && (
        <FlatList
          data={clients}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleClientSelect(item)}
              style={styles.clientItem}
            >
              <Text>ID: {item.id}</Text>
              <Text>DNI: {item.dni}</Text>
              <Text>Nombre: {item.fullName}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <ConfirmButton title="Agregar Dispositivo" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  clientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddDevice;
