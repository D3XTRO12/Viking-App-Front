import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useCommonHooks } from '../components/hooks/useCommonHooks';
import api from '../components/axios/Axios';
import styles from '../components/styles/WorkOrderStyles';
import SectionListWrapper from '../components/wrappers-sections/SectionListWrapper';
import ConfirmButton from '../components/buttons/ConfirmButton';
import SearchButton from '../components/buttons/SearchButton';
import { DeviceInterface } from '../components/interfaces/DeviceInterface';
import { ADMIN_ROLE_ID } from '@env';
import axios from 'axios';

// Definir interfaces para los tipos de datos que se manejan
interface Technician {
  id: string;
  name: string;
}

interface Device {
  id: number;
  brand: string;
  model: string;
  type: string;
  serialNumber: string;
  userId?: string; // Hacer `userId
  userName: string;
}

const AddWorkOrder: React.FC = () => {
  const {
    issueDescription,
    setIssueDescription,
    clientDni,
    setClientDni,
    foundClient,
    setFoundClient,
    deviceBrand,
    setDeviceBrand,
    devices,
    setDevices,
    selectedDevice,
    setSelectedDevice,
    staffId,
    setStaffId,
    repairStatus,
    setRepairStatus,
    resetForm,
  } = useCommonHooks();

  const [technicians, setTechnicians] = useState<Technician[]>([]); // Definir el tipo de estado como Technician[]

  // Obtener la lista de técnicos al montar el componente
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {   
        const response = await api.get(`/api/user/search?query=by-role&roleId=${ADMIN_ROLE_ID}`);
        setTechnicians(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de técnicos:', error);
      }
    };

    fetchTechnicians();
  }, []);

  const handleClientSearch = async () => {
    if (!clientDni) {
      return Alert.alert('Error', 'Por favor, ingrese el DNI del cliente.');
    }
    try {
      const response = await api.get(`/api/user/search?query=by-dni&dni=${clientDni}`);
      setFoundClient(response.data);
    } catch (error) {
      console.error('Error al buscar el cliente:', error);
      Alert.alert('Error', 'No se pudo encontrar al cliente');
    }
  };
  function isValidUUID(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  const handleDeviceSearch = async () => {
    const trimmedBrand = deviceBrand.trim();

    if (!trimmedBrand) {
      Alert.alert('Error', 'Por favor, ingrese la marca del dispositivo.');
      return;
    }

    try {
      const deviceResponse = await api.get(`/api/device/search?query=by-brand&brand=${trimmedBrand}`);
      const devices = deviceResponse.data;

      interface Device {
        id: number;
        brand: string;
        model: string;
        type: string;
        serialNumber: string;
        userId: string;
        userName: string;
      }

      interface UserResponse {
        data: {
          name: string;
        };
      }
      const devicesWithUserNames: Device[] = await Promise.all(
        devices.map(async (device: Device): Promise<Device> => {
          if (device.userId && isValidUUID(device.userId)) {
            try {
              const userResponse: UserResponse = await api.get(`/api/user/search?query=by-id&id=${device.userId}`);
              return {
                ...device,
                userName: userResponse.data.name || 'Desconocido',
              };
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error('Error al obtener el nombre del usuario con ID: ${device.userId}, error.response?.data, error.response?.status');
              } else {
                console.error('Error desconocido al obtener el nombre del usuario con ID: ${device.userId}, error');
              }
              return {
                ...device,
                userName: 'Error al obtener nombre',
              };
            }
          } else {
            return {
              ...device,
              userName: 'ID de usuario no disponible o inválido',
            };
          }
        })
      );
      setDevices(devicesWithUserNames);
    } catch (error) {
      console.error('Error al buscar dispositivos:', error);
      Alert.alert('Error', 'No se pudo encontrar los dispositivos');
    }
  };

  const handleSubmit = async () => {
    if (!issueDescription || !foundClient || !selectedDevice || !staffId || !repairStatus) {
      return Alert.alert('Error', 'Todos los campos son obligatorios.');
    }

    const workOrderData = {
      issueDescription,
      clientId: foundClient.id,
      deviceId: selectedDevice.id,
      staffId: staffId,
      repairStatus,
    };
    try {
      await api.post('/api/work-order/save', workOrderData);
      Alert.alert('Éxito', 'Orden de trabajo agregada correctamente');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la orden de trabajo');
    }
  };

  // Especificar el tipo de `item` en render
 const renderTechnicianItem = ({ item }: { item: Technician }) => (
  <TouchableOpacity onPress={() => setStaffId(item.id)} style={styles.deviceItem}>
    <Text>{item.name}</Text>
  </TouchableOpacity>
);

  const renderDeviceItem = ({ item }: { item: Device }) => {
    // Crear un objeto que coincida con `DeviceInterface`
    const selectedDevice: DeviceInterface = {
      id: item.id,
      brand: item.brand,
      model: item.model,
      type: item.type,
      serialNumber: item.serialNumber,
      userName: item.userName,
      userId: item.userId || 'N/A'  // Aseguramos que `userId` no esté indefinido
    };
  
    return (
      <TouchableOpacity onPress={() => setSelectedDevice(selectedDevice)} style={styles.deviceItem}>
        <Text>{item.brand} {item.model}</Text>
        <Text>Tipo: {item.type}</Text>
        <Text>Número de serie: {item.serialNumber}</Text>
        <Text>Nombre del Cliente: {item.userName}</Text>
      </TouchableOpacity>
    );
  };

  const sections = [
    {
      title: 'Descripción',
      data: [
        {
          key: 'Descripción del problema',
          component: (
            <>
              <Text style={styles.label}>Descripción del problema</Text>
              <TextInput
                value={issueDescription}
                onChangeText={setIssueDescription}
                placeholder="Descripción del problema"
                style={styles.input}
              />
            </>
          ),
        },
      ],
    },
    {
      title: 'Cliente',
      data: [
        {
          key: 'Buscar Cliente',
          component: (
            <>
              <Text style={styles.label}>DNI del Cliente</Text>
              <TextInput
                value={clientDni}
                onChangeText={setClientDni}
                placeholder="DNI"
                keyboardType="numeric"
                style={styles.input}
              />
              <SearchButton title="Buscar Cliente" onPress={handleClientSearch} />
              {foundClient && (
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientInfoText}>Datos del Cliente:</Text>
                  <Text>ID: {foundClient.id}</Text>
                  <Text>DNI: {foundClient.dni}</Text>
                  <Text>Nombre: {foundClient.name}</Text>
                </View>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Dispositivo',
      data: [
        {
          key: 'Buscar Dispositivos',
          component: (
            <>
              <Text style={styles.label}>Marca del Dispositivo</Text>
              <TextInput
                value={deviceBrand}
                onChangeText={setDeviceBrand}
                placeholder="Marca del dispositivo"
                style={styles.input}
              />
              <SearchButton title="Buscar Dispositivos" onPress={handleDeviceSearch} />
              {devices.length > 0 && (
                <FlatList
                  data={devices}
                  renderItem={renderDeviceItem}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                />
              )}
              {selectedDevice && (
                <View style={styles.selectedDeviceContainer}>
                  <Text style={styles.label}>Dispositivo seleccionado:</Text>
                  <Text>{selectedDevice.brand} {selectedDevice.model}</Text>
                  <Text>Tipo: {selectedDevice.type}</Text>
                  <Text>Número de serie: {selectedDevice.serialNumber}</Text>
                  <Text>Nombre del Cliente: {selectedDevice.userName}</Text>
                </View>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Técnico',
      data: [
        {
          key: 'Seleccionar Técnico',
          component: (
            <>
              <Text style={styles.label}>Seleccionar Técnico</Text>
              {technicians.length > 0 && (
                <FlatList
                  data={technicians}
                  renderItem={renderTechnicianItem}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                />
              )}
              {staffId && (
                <View style={styles.selectedDeviceContainer}>
                  <Text style={styles.label}>
                    Técnico seleccionado: {technicians.find(tech => tech.id === staffId)?.name}
                  </Text>
                </View>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Campos Adicionales',
      data: [
        {
          key: 'Campos Adicionales',
          component: (
            <>
              <Text style={styles.label}>Estatus de reparación</Text>
              <TextInput
                value={repairStatus}
                onChangeText={setRepairStatus}
                placeholder="Estatus de reparación"
                style={styles.input}
              />
              <ConfirmButton title="Agregar Orden de Trabajo" onPress={handleSubmit} />
            </>
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

export default AddWorkOrder;
