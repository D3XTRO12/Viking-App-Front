import React from 'react';
import { Text, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, KeyboardTypeOptions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCommonHooks } from '../components/hooks/useCommonHooks';
import { searchClient } from '../components/axios/ClientsAxios';
import api from '../components/axios/Axios'; // Importa el módulo api
import styles from '../components/styles/Styles';
import SectionListWrapper from '../components/wrappers-sections/SectionListWrapper';
import SearchButton from '../components/buttons/SearchButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import { ClientInterface } from '../components/interfaces/ClientInterface';

interface InputSectionProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}

const InputSection: React.FC<InputSectionProps> = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
  </>
);

interface PickerSectionProps {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  items: string[];
}

const PickerSection: React.FC<PickerSectionProps> = ({ label, selectedValue, onValueChange, items }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      <Picker.Item label={`Seleccionar ${label.toLowerCase()}`} value="" />
      {items.map((item) => (
        <Picker.Item key={item} label={item} value={item} />
      ))}
    </Picker>
  </>
);

interface ClientSearchSectionProps {
  clientDni: string;
  setClientDni: (dni: string) => void;
  handleClientSearch: () => void;
  foundClient: ClientInterface | null;
  handleClientSelect: (client: ClientInterface) => void;
}

const ClientSearchSection: React.FC<ClientSearchSectionProps> = ({ clientDni, setClientDni, handleClientSearch, foundClient, handleClientSelect }) => (
  <>
    <InputSection
      label="DNI del Cliente"
      value={clientDni}
      onChangeText={setClientDni}
      placeholder="DNI del Cliente"
      keyboardType="numeric"
    />
    <SearchButton title="Buscar Cliente" onPress={handleClientSearch} />
    {foundClient && (
      <TouchableOpacity
        onPress={() => handleClientSelect(foundClient)}
        style={styles.clientItem}
      >
        <Text>ID: {foundClient.id}</Text>
        <Text>Nombre: {foundClient.name}</Text>
        <Text>DNI: {foundClient.dni}</Text>        
      </TouchableOpacity>
    )}
  </>
);
const AddDevice: React.FC = () => {
  const {
    clientDni,
    setClientDni,
    foundClient,
    setFoundClient,
    resetForm,
  } = useCommonHooks();

  // Hooks adicionales específicos para AddDevice
  const [type, setType] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [serialNumber, setSerialNumber] = React.useState('');
  const [selectedClientMessage, setSelectedClientMessage] = React.useState(''); // Nuevo estado para el mensaje

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

  const handleClientSearch = async () => {
    if (!clientDni) {
      Alert.alert('Error', 'Por favor ingresa un DNI.');
      return;
    }
    try {
      const response = await api.get(`/api/user/search?query=by-dni&dni=${clientDni}`);
      const clientData: ClientInterface = response.data; // Asegúrate de que la estructura de la respuesta sea correcta
      setFoundClient(clientData);
      setSelectedClientMessage(''); // Resetea el mensaje al buscar
    } catch (error) {
      console.error('Error al buscar el cliente:', error);
      Alert.alert('Error', 'No se pudo encontrar al cliente');
    }
  };

  const handleClientSelect = (client: ClientInterface): void => {
    setFoundClient(client);
    setSelectedClientMessage(`Has seleccionado a ${client.name}`); // Establece el mensaje
  };

  const handleSubmit = async () => {
    if (!type || !brand || !model || !serialNumber || !foundClient) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
  
    const deviceData = {
      type,
      brand,
      model,
      serialNumber,
      userId: foundClient.id // Asegúrate de que estás enviando userId
    };
  
    try {
      const response = await api.post('/api/device/save', deviceData);
      Alert.alert('Éxito', response.data); // Suponiendo que la respuesta es un mensaje
      resetForm();
      setType('');
      setBrand('');
      setModel('');
      setSerialNumber('');
    } catch (error) {
      console.error('Error al guardar el dispositivo:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar el dispositivo');
    }
  };

  const sections = [
    {
      title: 'Información del Dispositivo',
      data: [
        {
          key: 'Tipo de Dispositivo',
          component: (
            <PickerSection
              label="Tipo de Dispositivo"
              selectedValue={type}
              onValueChange={setType}
              items={deviceTypes}
            />
          ),
        },
        {
          key: 'Marca',
          component: (
            <InputSection
              label="Marca"
              value={brand}
              onChangeText={setBrand}
              placeholder="Marca"
            />
          ),
        },
        {
          key: 'Modelo',
          component: (
            <InputSection
              label="Modelo"
              value={model}
              onChangeText={setModel}
              placeholder="Modelo"
            />
          ),
        },
        {
          key: 'Número de Serie',
          component: (
            <InputSection
              label="Número de Serie"
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="Número de Serie"
            />
          ),
        },
      ],
    },
    {
      title: 'Información del Cliente',
      data: [
        {
          key: 'Búsqueda de Cliente',
          component: (
            <ClientSearchSection
              clientDni={clientDni}
              setClientDni={setClientDni}
              handleClientSearch={handleClientSearch}
              foundClient={foundClient}
              handleClientSelect={handleClientSelect}
            />
          ),
        },
        // Mostrar mensaje de selección
        {
          key: 'Mensaje Selección',
          component: (
            <Text style={styles.selectedClientMessage}>
              {selectedClientMessage}
            </Text>
          ),
        },
      ],
    },
    {
      title: 'Confirmación',
      data: [
        {
          key: 'Agregar Dispositivo',
          component: (
            <ConfirmButton title="Agregar Dispositivo" onPress={handleSubmit} />
          ),
        },
        {
          key: 'Volver',
          component: (
            <TouchableOpacity onPress={() => { /* Lógica para volver */ }} style={styles.backButton}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          ),
        },
      ],
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <SectionListWrapper sections={sections} />
    </KeyboardAvoidingView>
  );
};

export default AddDevice;
