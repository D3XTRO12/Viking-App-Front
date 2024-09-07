import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { saveClient } from '../components/axios/ClientsAxios';
import styles from '../components/styles/ClientsStyles';
import ConfirmButton from '../components/buttons/ConfirmButton'; // Asegúrate de tener la ruta correcta

const AddClients: React.FC = () => {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');

  const handleSubmit = async () => {
    if (!name || !dni || !address || !phoneNumber) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const clientData = {
      name,
      dni: parseInt(dni),
      address,
      phoneNumber,
      secondaryPhoneNumber: secondaryPhoneNumber || null,
    };

    const success = await saveClient(clientData);
    if (success) {
      Alert.alert('Éxito', 'Cliente agregado correctamente');
      setName('');
      setDni('');
      setAddress('');
      setPhoneNumber('');
      setSecondaryPhoneNumber('');
    } else {
      Alert.alert('Error', 'No se pudo agregar el cliente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Teléfono"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Teléfono Secundario"
        value={secondaryPhoneNumber}
        onChangeText={setSecondaryPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Botón de Confirmación */}
      <ConfirmButton title="Agregar Cliente" onPress={handleSubmit} />
    </View>
  );
};

export default AddClients;
