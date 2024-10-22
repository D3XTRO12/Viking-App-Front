import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar, HelperText } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import api from '../../../../src/components/axios/Axios';
import { useCommonHooks } from '../../../../src/components/hooks/useCommonHooks';

export default function EditUser() {
  const { resetForm } = useCommonHooks();
  const { id: routeId } = useLocalSearchParams<{ id: string }>();

  const [id, setId] = useState(routeId || '');
  const [searchDni, setSearchDni] = useState('');
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cuit, setCuit] = useState('');
  const [isEditing, setIsEditing] = useState(!!routeId);

  const searchUserByDni = async () => {
    try {
      const response = await api.get(`/api/user/search?query=by-dni&dni=${searchDni}`);
      if (response.data) {
        const userData = response.data;
        setId(userData.id);
        setName(userData.name);
        setDni(userData.dni.toString());
        setAddress(userData.address);
        setPhoneNumber(userData.phoneNumber);
        setSecondaryPhoneNumber(userData.secondaryPhoneNumber);
        setEmail(userData.email);
        setCuit(userData.cuit);
        setIsEditing(true);
      } else {
        alert('No se encontró ningún usuario con ese DNI');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('No se pudo buscar el usuario');
    }
  };

  const validateFields = () => {
    const requiredFields = [
      { field: name, name: 'Nombre' },
      { field: dni, name: 'DNI' },
      { field: address, name: 'Dirección' },
      { field: phoneNumber, name: 'Teléfono' },
      { field: email, name: 'Email' },
    ];

    const missingFields = requiredFields.filter(field => !field.field.trim());

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => field.name).join(', ');
      alert(`Los siguientes campos son obligatorios: ${missingFieldNames}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      const userData = {
        id,
        name,
        dni: parseInt(dni),
        address,
        phoneNumber,
        secondaryPhoneNumber,
        email,
        cuit,
      };

      await api.put(`/api/user/update/${id}`, userData);

      alert('Los datos del usuario se actualizaron correctamente');
      resetForm();
      router.back();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('No se pudo actualizar el usuario');
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Editar Usuario" />
      </Appbar.Header>
      <ScrollView style={{ padding: 16 }}>
        {!isEditing ? (
          <>
            <TextInput
              label="Buscar usuario por DNI"
              value={searchDni}
              onChangeText={setSearchDni}
              keyboardType="numeric"
              mode="outlined"
            />
            <Button mode="contained" onPress={searchUserByDni} style={{ marginTop: 10 }}>
              Buscar Usuario
            </Button>
          </>
        ) : (
          <>
            <TextInput
              label="Nombre"
              value={name}
              onChangeText={setName}
              mode="outlined"
            />
            <TextInput
              label="DNI"
              value={dni}
              onChangeText={setDni}
              keyboardType="numeric"
              mode="outlined"
              disabled
            />
            <HelperText type="info">El DNI no puede ser modificado</HelperText>
            <TextInput
              label="Dirección"
              value={address}
              onChangeText={setAddress}
              mode="outlined"
            />
            <TextInput
              label="Teléfono"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              mode="outlined"
            />
            <TextInput
              label="Teléfono Secundario"
              value={secondaryPhoneNumber}
              onChangeText={setSecondaryPhoneNumber}
              keyboardType="phone-pad"
              mode="outlined"
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              mode="outlined"
            />
            <TextInput
              label="CUIT"
              value={cuit}
              onChangeText={setCuit}
              mode="outlined"
            />
            <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
              Actualizar Usuario
            </Button>
          </>
        )}
      </ScrollView>
    </PaperProvider>
  );
}