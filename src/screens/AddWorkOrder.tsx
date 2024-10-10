import React, { useEffect, useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useCommonHooks } from '../components/hooks/useCommonHooks';
import api from '../components/axios/Axios';
import styles from '../components/styles/Styles';
import SectionListWrapper from '../components/wrappers-sections/SectionListWrapper';
import { DeviceInterface } from '../components/interfaces/DeviceInterface';
import { ADMIN_ROLE_ID } from '@env';
import PickerSection from '../components/styles/PickerSection';
import { Button, TextInput as PaperTextInput } from 'react-native-paper';

interface Technician {
  id: string;
  name: string;
}

const AddWorkOrder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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

  const [technicians, setTechnicians] = useState<Technician[]>([]);

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

  // Mapeo de estados en inglés y español
  const repairStatusMap = {
    'Pendiente': 'Pending',
    'En Progreso': 'In Progress',
    'Completado': 'Completed',
    'Cancelado': 'Canceled',
  };

  const listRepairStatusSpanish = Object.keys(repairStatusMap); // Lista en español

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

  const handleDeviceSearch = async () => {
    const trimmedBrand = deviceBrand.trim();
  
    if (!trimmedBrand) {
      Alert.alert('Error', 'Por favor, ingrese la marca del dispositivo.');
      return;
    }
  
    try {
      const deviceResponse = await api.get(`/api/device/search?query=by-brand&brand=${trimmedBrand}`);
      const devicesWithNames = await Promise.all(
        deviceResponse.data.map(async (device: DeviceInterface) => {
          const clientName = await fetchClientName(device.userId);
          return {
            ...device,
            userName: clientName,
          };
        })
      );
      setDevices(devicesWithNames);
    } catch (error) {
      console.error('Error al buscar dispositivos:', error);
      Alert.alert('Error', 'No se pudo encontrar los dispositivos');
    }
  };
  
  const fetchClientName = async (clientId: string) => {
    try {
      const response = await api.get(`/api/user/search?query=by-id&id=${clientId}`);
      return response.data.name;
    } catch (error) {
      console.error('Error al obtener el nombre del cliente:', error);
      return 'Cliente no encontrado';
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
      repairStatus,  // El valor en inglés ya está aquí
    };
    try {
      await api.post('/api/work-order/save', workOrderData);
      Alert.alert('Éxito', 'Orden de trabajo agregada correctamente');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la orden de trabajo');
    }
  };

  const renderTechnicianItem = ({ item }: { item: Technician }) => (
    <TouchableOpacity onPress={() => setStaffId(item.id)} style={styles.deviceItem}>
      <Text style={styles.clientInfoText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDeviceItem = ({ item }: { item: DeviceInterface }) => (
    <TouchableOpacity onPress={() => setSelectedDevice(item)} style={styles.deviceItem}>
      <Text style={styles.clientInfoText}>{item.brand} {item.model}</Text>
      <Text style={styles.clientInfoText}>Tipo: {item.type}</Text>
      <Text style={styles.clientInfoText}>Número de serie: {item.serialNumber}</Text>
      <Text style={styles.clientInfoText}>Nombre del Cliente: {item.userName}</Text>
    </TouchableOpacity>
  );

  const sections = [
    {
      title: 'Descripción',
      data: [
        {
          key: 'Descripción del problema',
          component: (
            <>
              <Text style={styles.label}>Descripción del problema</Text>
              <PaperTextInput
                value={issueDescription}
                onChangeText={setIssueDescription}
                placeholder="Descripción del problema"
                mode="outlined"
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
              <PaperTextInput
                value={clientDni}
                onChangeText={setClientDni}
                placeholder="DNI"
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleClientSearch}>Buscar Cliente</Button>
              {foundClient && (
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientInfoText}>Datos del Cliente:</Text>
                  <Text style={styles.clientInfoText}>ID: {foundClient.id}</Text>
                  <Text style={styles.clientInfoText}>DNI: {foundClient.dni}</Text>
                  <Text style={styles.clientInfoText}>Nombre: {foundClient.name}</Text>
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
              <PaperTextInput
                value={deviceBrand}
                onChangeText={setDeviceBrand}
                placeholder="Marca del dispositivo"
                mode="outlined"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleDeviceSearch}>Buscar Dispositivos</Button>
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
                  <Text style={styles.clientInfoText}>Tipo: {selectedDevice.type}</Text>
                  <Text style={styles.clientInfoText}>Número de serie: {selectedDevice.serialNumber}</Text>
                  <Text style={styles.clientInfoText}>Nombre del Cliente: {selectedDevice.userName}</Text>
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
      title: 'Estado de la Reparación',
      data: [
        {
          key: 'Estado',
          component: (
            <>
              <PickerSection
                label="Estado"
                value={repairStatus}
                onValueChange={setRepairStatus}
                items={listRepairStatusSpanish}
              />
            </>
          ),
        },
      ],
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <SectionListWrapper sections={sections} />
      <Button mode="contained" onPress={handleSubmit}>
        Agregar Orden de Trabajo
      </Button>
      <Button mode="text" onPress={onBack}>
        Volver
      </Button>
    </KeyboardAvoidingView>
  );
};

export default AddWorkOrder;
