import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import api from '../../../src/components/axios/Axios';
import { useCommonHooks } from '../../../src/components/hooks/useCommonHooks';

interface Role {
  id: string;
  descripcion: string;
  permission: string;
}

export default function CreateUser() {
  const { resetForm } = useCommonHooks();
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [userType, setUserType] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cuit, setCuit] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [userTypeMenuVisible, setUserTypeMenuVisible] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/auth/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role);
    setRoleId(role.id);
  };

  const validateFields = () => {
    const requiredFields = [
      { field: name, name: 'Nombre' },
      { field: dni, name: 'DNI' },
      { field: userType, name: 'Tipo de Usuario' },
      { field: address, name: 'Dirección' },
      { field: phoneNumber, name: 'Teléfono' },
      { field: email, name: 'Email' },
      { field: password, name: 'Contraseña' },
      { field: roleId, name: 'Rol' }
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
        name,
        dni: parseInt(dni),
        userType,
        address,
        phoneNumber,
        secondaryPhoneNumber,
        email,
        password,
        cuit,
        roleId
      };
      await api.post('/api/user/save', userData);
      alert('El cliente se creó correctamente');
      resetForm();
    } catch (error) {
      alert('No se pudo crear el cliente');
      console.error('Error creating user:', error);
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Crear Nuevo Cliente" />
      </Appbar.Header>
      <ScrollView style={{ padding: 16 }}>
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
        />
        <Menu
          visible={userTypeMenuVisible}
          onDismiss={() => setUserTypeMenuVisible(false)}
          anchor={
            <Button onPress={() => setUserTypeMenuVisible(true)}>
              {userType || "Seleccione un tipo de usuario"}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setUserType('end-user'); setUserTypeMenuVisible(false); }} title="Usuario final" />
          <Menu.Item onPress={() => { setUserType('staff'); setUserTypeMenuVisible(false); }} title="Staff" />
          <Menu.Item onPress={() => { setUserType('company'); setUserTypeMenuVisible(false); }} title="Compañía" />
        </Menu>
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
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
        />
        <TextInput
          label="CUIT"
          value={cuit}
          onChangeText={setCuit}
          mode="outlined"
        />
        <Button onPress={fetchRoles} mode="contained">
          Mostrar Roles
        </Button>
        {selectedRole && (
          <Text>Rol seleccionado: {selectedRole.descripcion}</Text>
        )}
        {roles.map((role) => (
          <Button
            key={role.id}
            onPress={() => handleRoleSelection(role)}
            mode="outlined"
          >
            {role.descripcion}
          </Button>
        ))}
        <Button onPress={handleSubmit} mode="contained">
          Crear Cliente
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}