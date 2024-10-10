import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../components/styles/Styles';
import ConfirmButton from '../../components/buttons/ConfirmButton';
import SearchButton from '../../components/buttons/SearchButton';
import api from '../../components/axios/Axios';
import { useCommonHooks } from '../../components/hooks/useCommonHooks';
import CustomAlert from '../../components/alerts/CustomAlerts';
interface EditUserProps {
  onBack: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ onBack }) => {
  const { resetForm } = useCommonHooks();
  const [id, setId] = useState('');
  const [searchDni, setSearchDni] = useState('');
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cuit, setCuit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);

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
        setModalContent({ title: 'Usuario no encontrado', message: 'No se encontró ningún usuario con ese DNI' });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setModalContent({ title: 'Error', message: 'No se pudo buscar el usuario' });
      setModalVisible(true);
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
        id,
        name,
        dni: parseInt(dni),
        address,
        phoneNumber,
        secondaryPhoneNumber,
        email,
        cuit,
      };

      console.log("Updating user with id:", id);
      await api.put(`/api/user/update/${id}`, userData);

      setModalContent({ title: 'Usuario actualizado', message: 'Los datos del usuario se actualizaron correctamente' });
      setModalVisible(true);
      resetForm();
      setIsEditing(false);
      setSearchDni('');

      // Vuelve a la pantalla handleUser
      onBack();
    } catch (error) {
      setModalContent({ title: 'Error', message: 'No se pudo actualizar el usuario' });
      setModalVisible(true);
      console.error('Error updating user:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>

      {!isEditing ? (
        <>
          <Text style={styles.label}>Buscar usuario por DNI</Text>
          <TextInput
            style={styles.input}
            value={searchDni}
            onChangeText={setSearchDni}
            placeholder="Ingrese DNI"
            keyboardType="numeric"
          />
          <SearchButton onPress={searchUserByDni} title="Buscar Usuario" />
        </>
      ) : (
        <>
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
            editable={false} // El DNI no debería ser editable una vez encontrado
          />

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

          <Text style={styles.label}>CUIT</Text>
          <TextInput
            style={styles.input}
            value={cuit}
            onChangeText={setCuit}
            placeholder="CUIT"
          />

          <ConfirmButton onPress={handleSubmit} title="Actualizar Usuario" />
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </>
      )}

      <CustomAlert
        title={modalContent.title}
        content={modalContent.message}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default EditUser;
