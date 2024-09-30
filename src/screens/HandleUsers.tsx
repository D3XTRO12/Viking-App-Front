import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../components/styles/Styles';
import ConfirmButton from '../components/buttons/ConfirmButton';
import SearchButton from '../components/buttons/SearchButton';
import api from '../components/axios/Axios';
import { useCommonHooks } from '../components/hooks/useCommonHooks';
import SweetAlert from 'react-native-sweet-alert';

interface Role {
  id: string;
  descripcion: string;
  permission: string;
}

const CreateUserScreen: React.FC = () => {
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

  const fetchRoles = async () => {
    try {
      const response = await api.get('/auth/roles');
      setRoles(response.data);
    } catch (error) {
      SweetAlert.showAlertWithOptions({
        title:'Error',
        subTitle: 'Hubo un problema al obtener los roles',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancelar',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true
      });
      console.error('Error fetching roles:', error);
      // Manejar el error (por ejemplo, mostrar un mensaje de error)
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
      SweetAlert.showAlertWithOptions({
        title:'Error',
        subTitle: 'Hubo un problema al obtener los roles',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancelar',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true
      });
      return false;
    }

    return true;
  };


  const handleSubmit = async () => {
    if (!validateFields()) {
      SweetAlert.showAlertWithOptions({
        title:'Error',
        subTitle: "Por favor, complete todos los campos",
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancelar',
        otherButtonColor: '#dedede',
        style: 'question',
        cancellable: true
      });
      
      return;
    }
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
      SweetAlert.showAlertWithOptions({
        title:'Éxito',
        subTitle: 'Cliente creado correctamente',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancelar',
        otherButtonColor: '#dedede',
        style: 'success',
        cancellable: true
      });
      resetForm();
    } catch (error) {
      SweetAlert.showAlertWithOptions({
        title:'Error',
        subTitle: 'Hubo un problema al crear el cliente',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancelar',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true
      });
      console.error('Error creating user:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Cliente</Text>
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre completo"
      />

      <Text style={styles.label}>DNI</Text>
      <TextInput
        style={styles.input}
        value={dni}
        onChangeText={setDni}
        placeholder="DNI"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Tipo de Usuario</Text>
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un tipo" value="" />
        <Picker.Item label="Usuario final" value="end-user" />
        <Picker.Item label="Staff" value="staff" />
        <Picker.Item label="Compañía" value="company" />
      </Picker>

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Dirección"
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Teléfono"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Teléfono Secundario</Text>
      <TextInput
        style={styles.input}
        value={secondaryPhoneNumber}
        onChangeText={setSecondaryPhoneNumber}
        placeholder="Teléfono secundario"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
      />

      <Text style={styles.label}>CUIT</Text>
      <TextInput
        style={styles.input}
        value={cuit}
        onChangeText={setCuit}
        placeholder="CUIT"
      />

      <Text style={styles.label}>Rol</Text>
      <View style={styles.container}>
        <SearchButton onPress={fetchRoles} title={'Mostrar Roles'} />
        {selectedRole && (
          <Text style={styles.label}>
            Rol seleccionado: {selectedRole.descripcion}
          </Text>
        )}
      </View>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clientItem}
            onPress={() => handleRoleSelection(item)}
          >
            <Text style={styles.label}>{item.descripcion}</Text>
            <Text>{item.permission}</Text>
          </TouchableOpacity>
        )}
      />

      <ConfirmButton onPress={handleSubmit} title="Crear Cliente" />
    </ScrollView>
  );
};

export default CreateUserScreen;