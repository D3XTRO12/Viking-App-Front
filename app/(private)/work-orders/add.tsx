import React, { useEffect } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Importa el hook useRouter
import { useCommonHooks } from '../../../src/components/hooks/useCommonHooks';
import api from '../../axios/Axios';
import styles from '../../../src/components/styles/Styles';
import SectionListWrapper from '../../../src/components/wrappers-sections/SectionListWrapper';
import { DeviceInterface } from '../../../src/components/interfaces/DeviceInterface';
import { ADMIN_ROLE_ID } from '@env';
import PickerSection from '../../../src/components/styles/PickerSection';
import { Button, TextInput as PaperTextInput } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { Staff } from '../../../src/components/interfaces/StaffInterface';
import ConfirmButton from '../../../src/components/buttons/ConfirmButton';

const AddWorkOrder: React.FC = () => {
  const router = useRouter(); // Hook para manejar la navegación

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

  // Fetching Staffs using useQuery
  const { data: Staffs = [], isLoading: isLoadingStaffs, error: StaffsError } = useQuery<Staff[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await api.get(`/api/user/search?query=by-role&roleId=${ADMIN_ROLE_ID}`);
      return response.data;
    }
  });

  useEffect(() => {
    if (StaffsError) {
      Alert.alert('Error', 'No se pudieron cargar los técnicos');
    }
  }, [StaffsError]);

  const repairStatusMap = {
    'Pendiente': 'Pending',
    'En Progreso': 'In Progress',
    'Completado': 'Completed',
    'Cancelado': 'Canceled',
  };

  const listRepairStatusSpanish = Object.keys(repairStatusMap);

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

  const renderStaffItem = ({ item }: { item: Staff }) => (
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
              <Button mode="contained" onPress={handleClientSearch} style={styles.button}>Buscar Cliente</Button>
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
              <Button mode="contained" onPress={handleDeviceSearch} style={styles.button}>Buscar Dispositivos</Button>
              {devices.length > 0 && (
                <FlashList
                  data={devices}
                  renderItem={renderDeviceItem}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                  estimatedItemSize={76}

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
              {isLoadingStaffs ? (
                <Text>Cargando técnicos...</Text>
              ) : (
                Staffs.length > 0 && (
                  <FlashList
                    data={Staffs}
                    renderItem={renderStaffItem}
                    keyExtractor={(item) => item.id.toString()}
                    keyboardShouldPersistTaps="handled"
                    estimatedItemSize={76}
                  />
                )
              )}
              {staffId && (
                <View style={styles.selectedDeviceContainer}>
                  <Text style={styles.label}>
                    Técnico seleccionado: {(Staffs as Staff[]).find(tech => tech.id === staffId)?.name}
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
          key: 'Estado de la Reparación',
          component: (
            <>
              <PickerSection
                items={listRepairStatusSpanish}
                value={repairStatus}
                onValueChange={setRepairStatus}
                label="Seleccionar Estado"
              />
              <ConfirmButton onPress={handleSubmit} title="Guardar Orden de Trabajo" />
              {/* Botón para volver */}
              <Button mode="contained" onPress={() => router.push('/work-orders')} style={styles.button}>
                Volver
              </Button>
            </>
          ),
        },
      ],
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <SectionListWrapper sections={sections} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddWorkOrder;
