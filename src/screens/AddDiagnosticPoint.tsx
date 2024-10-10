import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import ConfirmButton from '../components/buttons/ConfirmButton';
import styles from '../components/styles/Styles';
import { useAuth } from '../components/context/AuthContext';
import api from '../components/axios/Axios';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

interface WorkOrder {
  id: string;
  deviceId: string;
  issueDescription: string;
}

interface Device {
  brand: string;
  model: string;
  serialNumber: string;
}

interface WorkOrderWithDevice extends WorkOrder {
  device?: Device;
}

interface DiagnosticPoint {
  workOrder: { id: string };
  timestamp: string;
  description: string;
  notes: string;
  image?: string;
}

const AddDiagnosticPoint: React.FC = () => {
  const { user, getToken } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrderWithDevice[]>([]);
  const [selectedWorkOrderDetails, setSelectedWorkOrderDetails] = useState<WorkOrderWithDevice | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticPoint>({
    workOrder: { id: '' },
    timestamp: new Date().toISOString(),
    description: '',
    notes: ''
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setDiagnosticData({ ...diagnosticData, image: uri });
    }
  };

  useEffect(() => {
    fetchWorkOrders();
    renderWorkOrder;
  }, [user]);

  const fetchWorkOrders = async () => {
    if (!user || !user.email) {
      console.error('No se encontró el email del usuario autenticado');
      Alert.alert('Error', 'No se pudo obtener la información del usuario.');
      return;
    }

    try {
      const userResponse = await api.get(`/api/user/search?query=by-email&email=${encodeURIComponent(user.email)}`);
      const userId = userResponse.data?.id;
      if (!userId) throw new Error('No se pudo obtener el ID del usuario');

      const workOrderResponse = await api.get(`/api/work-order/search?query=by-staffid&staffId=${userId}`);
      const workOrdersData = workOrderResponse.data as WorkOrder[];

      const workOrdersWithDevices = await Promise.all(workOrdersData.map(async (workOrder) => {
        try {
          const deviceResponse = await api.get(`/api/device/search?query=by-id&id=${workOrder.deviceId}`);
          const deviceData = deviceResponse.data;
          return {
            ...workOrder,
            device: {
              brand: deviceData.brand,
              model: deviceData.model,
              serialNumber: deviceData.serialNumber
            }
          };
        } catch (error) {
          console.error(`Error fetching device for work order ${workOrder.id}:`, error);
          return workOrder;
        }
      }));

      setWorkOrders(workOrdersWithDevices);   
    } catch (error) {
      console.error('Error fetching work orders:', error);
      Alert.alert('Error', 'No se pudieron cargar las órdenes de trabajo.');
    }
  };

  const submitForm = async () => {
    if (!selectedWorkOrder || !diagnosticData.description || !diagnosticData.notes) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const token = await getToken();
      const formData = new FormData();
      const diagnosticPoint = {
        workOrder: { id: selectedWorkOrder },
        timestamp: diagnosticData.timestamp,
        description: diagnosticData.description,
        notes: diagnosticData.notes
      };

      formData.append('diagnosticPoint', JSON.stringify(diagnosticPoint));

      if (imageUri) {
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const uniqueFileName = `workOrder_${selectedWorkOrder}_${Date.now()}.${fileType}`;

        formData.append('file', {
          uri: imageUri,
          name: uniqueFileName,
          type: `image/${fileType}`,
        } as any);
      }

      console.log('FormData:', JSON.stringify(formData));

      try {
        const response = await api.post('/api/diagnostic-points/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          timeout: 30000, // Set a longer timeout (30 seconds)
        });

        console.log('Response:', response);

        if (response && response.status === 200) {
          Alert.alert('Éxito', 'Diagnóstico enviado con éxito');
        } else {
          throw new Error(`Error en la solicitud: ${response ? response.status : 'No response'}`);
        }
      } catch (apiError: any) {
        console.error('Error en la llamada API:', apiError);
        console.error('Error details:', apiError.response ? apiError.response.data : 'No response data');
        Alert.alert('Error', `No se pudo enviar el diagnóstico. ${apiError.message}`);
      }
    } catch (error) {
      console.error('Error al preparar el formulario:', error);
      Alert.alert('Error', 'No se pudo preparar el diagnóstico. Por favor, inténtalo de nuevo.');
    }
  };
  const resetSelectedWorkOrder = () => {
    setSelectedWorkOrder(null);
    setSelectedWorkOrderDetails(null);
  };
  
  const handleSelectWorkOrder = (id: string) => {
    resetSelectedWorkOrder();
    const selectedOrder = workOrders.find(order => order.id === id) || null;
    setSelectedWorkOrder(id);
    setSelectedWorkOrderDetails(selectedOrder);
    setDiagnosticData({ ...diagnosticData, workOrder: { id } });
  };

  const renderWorkOrder = ({ item }: { item: WorkOrderWithDevice }) => (
    <TouchableOpacity 
      onPress={() => handleSelectWorkOrder(item.id)} 
      style={[
        styles.workOrderItem,
        selectedWorkOrder === item.id && styles.selectedWorkOrderItem
      ]}
    >
      <Text style={[
        styles.workOrderText,
        selectedWorkOrder === item.id && styles.selectedWorkOrderText
      ]}>Orden de Trabajo: {item.id}</Text>
      <Text style={[
        styles.workOrderText,
        selectedWorkOrder === item.id && styles.selectedWorkOrderText
      ]}>Marca: {item.device?.brand || 'N/A'}</Text>
      <Text style={[
        styles.workOrderText,
        selectedWorkOrder === item.id && styles.selectedWorkOrderText
      ]}>Modelo: {item.device?.model || 'N/A'}</Text>
      <Text style={[
        styles.workOrderText,
        selectedWorkOrder === item.id && styles.selectedWorkOrderText
      ]}>Número de Serie: {item.device?.serialNumber || 'N/A'}</Text>
      <Text style={[
        styles.workOrderText,
        selectedWorkOrder === item.id && styles.selectedWorkOrderText
      ]}>Descripción: {item.issueDescription}</Text>
    </TouchableOpacity>
  );

  const renderWorkOrdersComponent = () => (
    <View style={styles.flashListSectionContainer}>
      <Text style={styles.sectionTitle}>Seleccionar Orden de Trabajo</Text>
      <FlashList
        data={workOrders}
        renderItem={renderWorkOrder}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        key={selectedWorkOrder}
      />
    </View>
  );

  const renderProblemDescriptionComponent = () => (
    <View style={styles.flashListContainer}>
      <Text style={styles.sectionTitle}>Descripción del Problema</Text>
      <TextInput
        placeholder="Descripción del problema"
        multiline
        value={diagnosticData.description}
        onChangeText={(text) => setDiagnosticData({ ...diagnosticData, description: text })}
        style={styles.input}
      />
    </View>
  );

  const renderAdditionalNotesComponent = () => (
    <View style={styles.flashListContainer}>
      <Text style={styles.sectionTitle}>Notas Adicionales</Text>
      <TextInput
        placeholder="Notas adicionales"
        multiline
        value={diagnosticData.notes}
        onChangeText={(text) => setDiagnosticData({ ...diagnosticData, notes: text })}
        style={styles.input}
      />
    </View>
  );

  const renderImagePickerComponent = () => (
    <Button mode="contained" onPress={handleImagePicker} style={styles.button}>
      Seleccionar imagen
    </Button>
  );

  const renderImagePreviewComponent = () => {
    if (imageUri) {
      return (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.imagePreview}
          />
        </View>
      );
    }
    return null;
  };

  const renderSubmitButtonComponent = () => (
    <ConfirmButton onPress={submitForm} title="Enviar Diagnóstico" />
  );

  return (
    <View style={styles.container}>
      {renderSubmitButtonComponent()}
      {renderWorkOrdersComponent()}
      {renderProblemDescriptionComponent()}
      {renderAdditionalNotesComponent()}
      {renderImagePickerComponent()}
      {renderImagePreviewComponent()}
      
    </View>
  );
};

export default AddDiagnosticPoint;
