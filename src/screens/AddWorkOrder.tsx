import React from 'react';
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useCommonHooks } from '../components/hooks/useCommonHooks';
import { searchClient } from '../components/axios/ClientsAxios';
import { searchDevices } from '../components/axios/DeviceAxios';
import { saveWorkOrder } from '../components/axios/WorkOrderAxios';
import styles from '../components/styles/WorkOrderStyles';
import SectionListWrapper from '../components/wrappers-sections/SectionListWrapper';
import ConfirmButton from '../components/buttons/ConfirmButton';
import SearchButton from '../components/buttons/SearchButton';

const AddWorkOrder: React.FC = () => {
  const {
    description,
    setDescription,
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

  const handleClientSearch = async () => {
    if (!clientDni) {
      Alert.alert('Error', 'Por favor, ingrese el DNI del cliente.');
      return;
    }
    await searchClient(clientDni, setFoundClient);
  };

  const handleDeviceSearch = async () => {
    if (!deviceBrand) {
      Alert.alert('Error', 'Por favor, ingrese la marca del dispositivo.');
      return;
    }
    await searchDevices(deviceBrand, setDevices);
  };

  const handleSubmit = async () => {
    if (!description || !foundClient || !selectedDevice || !staffId || !repairStatus) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const success = await saveWorkOrder(
      description,
      foundClient,
      selectedDevice,
      staffId,
      repairStatus,
      resetForm
    );

    if (success) {
      Alert.alert('Éxito', 'Orden de trabajo agregada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo agregar la orden de trabajo');
    }
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
                value={description}
                onChangeText={setDescription}
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
                  <Text>Nombre Completo: {foundClient.fullName}</Text>
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
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedDevice(item)}
                      style={styles.deviceItem}
                    >
                      <Text>{item.brand} {item.model}</Text>
                      <Text>Número de serie: {item.serialNumber}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  keyboardShouldPersistTaps="handled"
                />
              )}
              {selectedDevice && (
                <View style={styles.selectedDeviceContainer}>
                  <Text style={styles.label}>Dispositivo seleccionado:</Text>
                  <Text>{selectedDevice.brand} {selectedDevice.model}</Text>
                  <Text>Número de serie: {selectedDevice.serialNumber}</Text>
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
              <Text style={styles.label}>ID del técnico</Text>
              <TextInput
                value={staffId}
                onChangeText={setStaffId}
                placeholder="ID del técnico"
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.label}>Estatus de reparación</Text>
              <TextInput
                value={repairStatus}
                onChangeText={setRepairStatus}
                placeholder="Estatus de reparación"
                style={styles.input}
              />
              <ConfirmButton title="Agregar Orden de Trabajo" onPress={handleSubmit}/>
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
      keyboardVerticalOffset={100} // Ajusta este valor según tus necesidades
    >
      <SectionListWrapper sections={sections} />
    </KeyboardAvoidingView>
  );
};

export default AddWorkOrder;
