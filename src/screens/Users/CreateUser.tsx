import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../components/styles/Styles';
import ConfirmButton from '../../components/buttons/ConfirmButton';
import SearchButton from '../../components/buttons/SearchButton';
import api from '../../components/axios/Axios';
import { useCommonHooks } from '../../components/hooks/useCommonHooks';
import styled from 'styled-components/native';

interface CreateUserProps {
  onBack: () => void;
}

interface Role {
  id: string;
  descripcion: string;
  permission: string;
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <CenteredView>
        <ModalView>
          <Title>{title}</Title>
          <Message>{message}</Message>
          <Button onPress={onClose}>
            <ButtonText>Cerrar</ButtonText>
          </Button>
        </ModalView>
      </CenteredView>
    </Modal>
  );
};

const CreateUser: React.FC<CreateUserProps> = ({ onBack }) => {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

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
      setModalContent({ title: 'Campos faltantes', message: `Los siguientes campos son obligatorios: ${missingFieldNames}` });
      setModalVisible(true);
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
      setModalContent({ title: 'Cliente creado', message: 'El cliente se creó correctamente' });
      setModalVisible(true);
      resetForm();
    } catch (error) {
      setModalContent({ title: 'Error', message: 'No se pudo crear el cliente' });
      setModalVisible(true);
      console.error('Error creating user:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
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

      {roles.map((role) => (
        <TouchableOpacity
          key={role.id}
          style={styles.clientItem}
          onPress={() => handleRoleSelection(role)}
        >
          <Text style={styles.label}>{role.descripcion}</Text>
          <Text>{role.permission}</Text>
        </TouchableOpacity>
      ))}

      <ConfirmButton onPress={handleSubmit} title="Crear Cliente" />
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

      {/* Alert Modal */}
      <AlertModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
      />
  </View>
</ScrollView>
  );
};

// Estilos personalizados para el modal de alerta
const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const Message = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #2196F3;
  border-radius: 5px;
  padding: 10px 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export default CreateUser;
