import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, KeyboardTypeOptions } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import api from '../../axios/Axios';
import { useCommonHooks } from '../../../src/components/hooks/useCommonHooks';
import { FlashList } from '@shopify/flash-list';
import styles from '../../../src/components/styles/Styles';
import SectionListWrapper from '../../../src/components/wrappers-sections/SectionListWrapper';

interface Role {
  id: string;
  descripcion: string;
  permission: string;
}

interface InputSectionProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      mode="outlined"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || label}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </>
);

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

  useEffect(() => {
    fetchRoles();
  }, []);

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
      Alert.alert('Campos obligatorios', `Los siguientes campos son obligatorios: ${missingFieldNames}`);
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
      Alert.alert('Éxito', 'El cliente se creó correctamente');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el cliente');
      console.error('Error creating user:', error);
    }
  };

  const sections = [
    {
      title: 'Información Personal',
      data: [
        {
          key: 'personal-info',
          component: (
            <>
              <InputSection
                label="Nombre"
                value={name}
                onChangeText={setName}
              />
              <InputSection
                label="DNI"
                value={dni}
                onChangeText={setDni}
                keyboardType="numeric"
              />
              <Menu
                visible={userTypeMenuVisible}
                onDismiss={() => setUserTypeMenuVisible(false)}
                anchor={
                  <Button 
                    onPress={() => setUserTypeMenuVisible(true)} 
                    mode="outlined" 
                    style={styles.button}
                    labelStyle={styles.selectedText}  // Añadido el estilo para el texto
                  >
                    {userType || "Seleccione un tipo de usuario"}
                </Button>
                }
              >
                <Menu.Item onPress={() => { setUserType('end-user'); setUserTypeMenuVisible(false); }} title="Usuario final" />
                <Menu.Item onPress={() => { setUserType('staff'); setUserTypeMenuVisible(false); }} title="Staff" />
                <Menu.Item onPress={() => { setUserType('company'); setUserTypeMenuVisible(false); }} title="Compañía" />
              </Menu>
            </>
          ),
        },
      ],
    },
    {
      title: 'Información de Contacto',
      data: [
        {
          key: 'contact-info',
          component: (
            <>
              <InputSection
                label="Dirección"
                value={address}
                onChangeText={setAddress}
              />
              <InputSection
                label="Teléfono"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <InputSection
                label="Teléfono Secundario"
                value={secondaryPhoneNumber}
                onChangeText={setSecondaryPhoneNumber}
                keyboardType="phone-pad"
              />
              <InputSection
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </>
          ),
        },
      ],
    },
    {
      title: 'Información de Cuenta',
      data: [
        {
          key: 'account-info',
          component: (
            <>
              <InputSection
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputSection
                label="CUIT"
                value={cuit}
                onChangeText={setCuit}
              />
              <Button onPress={fetchRoles} mode="contained" style={styles.button}>
                Mostrar Roles
              </Button>
              {selectedRole && (
                <Text style={styles.selectedClientMessage}>
                  Rol seleccionado: {selectedRole.descripcion}
                </Text>
              )}
              <View style={styles.container}>
                <FlashList
                  data={roles}
                  renderItem={({ item }) => (
                    <Button
                      key={item.id}
                      onPress={() => handleRoleSelection(item)}
                      mode="outlined"
                      style={styles.button}
                      labelStyle={styles.selectedText}  // Añadido el estilo para el texto
                    >
                      {item.descripcion}
                    </Button>
                  )}
                  estimatedItemSize={10}
                />
              </View>
            </>
          ),
        },
      ],
    },
    {
      title: 'Confirmación',
      data: [
        {
          key: 'submit',
          component: (
            <Button onPress={handleSubmit} mode="contained" style={styles.button}>
              Crear Cliente
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.title}>Registro de Usuario</Text>
        <SectionListWrapper sections={sections} />
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}