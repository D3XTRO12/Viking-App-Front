import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import api from '../components/axios/Axios';
import axios from 'axios';
import { WorkOrder } from '../components/interfaces/WorkOrderInterface';
import AuthedImage from '../components/types/AuthedImages';
import { useAuth } from '../components/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import styles from '../components/styles/Styles';
import { Card, Paragraph, Title } from 'react-native-paper';
import AddWorkOrder from './AddWorkOrder';



interface DiagnosticPoint {
  id: string;
  timestamp: number;
  description: string;
  multimediaFiles: string[];
  notes: string;
}

const WorkOrderComponent: React.FC = () => {
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
const [selectedStatus, setSelectedStatus] = useState('');
const [orderId, setOrderId] = useState('');
  const [showAddWorkOrder, setShowAddWorkOrder] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticPoint[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [viewingDiagnostics, setViewingDiagnostics] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { getToken } = useAuth();

  const scale = useSharedValue<number>(1);
  const savedScale = useSharedValue<number>(1);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const focusX = useSharedValue<number>(0);
  const focusY = useSharedValue<number>(0);

  useEffect(() => {
    initializeUserData();
  }, []);

  const handleCreateWorkOrder = () => {
    setShowAddWorkOrder(true);
  };

  const handleBackFromAddWorkOrder = () => {
    setShowAddWorkOrder(false);
    // Opcional: Actualizar la lista de órdenes de trabajo después de crear una nueva
    if (userId) {
      fetchWorkOrders(isStaff, userId);
    }
  };
  
  const initializeUserData = async () => {
    try {
      const token = await getToken();
      if (token) {
        const decodedToken = jwtDecode<{ sub: string }>(token);
        const email = decodedToken.sub;
        const userResponse = await api.get(`/api/user/search?query=by-email&email=${email}`);
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        const staffResponse = await api.get<boolean>('/api/user-roles/is-staff');
        const staffStatus = staffResponse.data;
        setIsStaff(staffStatus);

        await fetchWorkOrders(staffStatus, fetchedUserId);
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      handleApiError(error);
    }
  };

  const fetchWorkOrders = async (staffStatus: boolean, fetchedUserId: string) => {
    try {
      const endpoint = staffStatus
        ? '/api/work-order/search?query=all'
        : `/api/work-order/search?query=by-clientid&clientId=${fetchedUserId}`;
  
      const response = await api.get<WorkOrder[]>(endpoint);
  
      if (response && response.data) {
        // Filtrar las órdenes de trabajo por repairStatus y estado
        const filteredWorkOrders = response.data.filter(
          (workOrder) => 
            workOrder.repairStatus === 'In Diagnosis' || 
            workOrder.repairStatus === 'Under Repair'
        );
  
        setWorkOrders(filteredWorkOrders);
        setViewingDiagnostics(false);
      } else {
        throw new Error('Respuesta vacía o inválida del servidor');
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  

  const handleSearch = async (orderId: string, clientId: string) => {
    try {
      const response = await api.get<DiagnosticPoint[]>(`/api/diagnostic-points/by-work-order/${orderId}/client/${clientId}`);
      setDiagnostics(response.data);
      setViewingDiagnostics(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los puntos de diagnóstico.');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/api/work-order/${orderId}`, { repairStatus: newStatus });
      if (userId) {
        await fetchWorkOrders(isStaff, userId);
        Alert.alert('Éxito', 'Estado de la orden actualizado.');
      } else {
        throw new Error('User ID is null');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la orden.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await api.delete(`/work-orders/${orderId}`);
      if (userId) {
        await fetchWorkOrders(isStaff, userId);
        Alert.alert('Éxito', 'Orden de trabajo eliminada.');
      } else {
        throw new Error('User ID is null');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la orden de trabajo.');
    }
  };

  const handleBackToWorkOrders = () => {
    setViewingDiagnostics(false);
    setDiagnostics(null);
  };

  const handleImagePress = (fileUrl: string) => {
    setSelectedImage(fileUrl);
    setModalVisible(true);
    resetZoom();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    resetZoom();
  };

  const resetZoom = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
  };

  const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        Alert.alert('Error', 'Hubo un problema con la solicitud. Por favor, intenta de nuevo.');
      } else if (error.request) {
        Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
      }
    } else {
      Alert.alert('Error', 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
    }
  };

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      focusX.value = event.focalX;
      focusY.value = event.focalY;
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(savedScale.value * event.scale, 1);
      translateX.value = event.focalX - focusX.value;
      translateY.value = event.focalY - focusY.value;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value += event.translationX;
      translateY.value += event.translationY;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const renderWorkOrderItem = ({ item }: { item: WorkOrder }) => (
    <Card style={styles.workOrderItem}>
      <Card.Content>
        <Text>Orden N°: {item.id}</Text>
        <Text>Estado: {item.repairStatus}</Text>
        {isStaff && (
          <View>
            <Button
              mode="contained"
              onPress={() => handleUpdateStatusModal(item.id)}
              style={styles.workOrderButton}
              labelStyle={styles.buttonText}
            >
              Actualizar Estado
            </Button>
            <Button
              mode="contained"
              onPress={() => handleDeleteOrder(item.id)}
              style={[styles.workOrderButton, { backgroundColor: 'red' }]} 
              labelStyle={styles.workOrderButtonText}
            >
              Eliminar
            </Button>
          </View>
        )}
        <Button
          mode="contained"
          onPress={() => handleSearch(item.id, item.clientId)}
          style={styles.workOrderButton}
          labelStyle={styles.workOrderButtonText}
        >
          Ver Diagnósticos
        </Button>
      </Card.Content>
    </Card>
  );

  const handleUpdateStatusModal = (id: string) => {
    setOrderId(id);
    setModalStatusVisible(true);
    setSelectedStatus('');
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };
  
  const handleUpdateStatusConfirm = async () => {
    if (selectedStatus) {
      await handleUpdateStatus(orderId, selectedStatus);
      setModalStatusVisible(false);
    }
  };
  const renderUpdateStatusModal = () => {
    if (modalStatusVisible) {
      return (
        <Modal visible={modalStatusVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Actualizar Estado</Text>
            <View style={styles.statusList}>
              <TouchableOpacity onPress={() => handleStatusChange('In Progress')}>
                <Text style={styles.statusItem}>En Progreso</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStatusChange('Completed')}>
                <Text style={styles.statusItem}>Completado</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStatusChange('Pending')}>
                <Text style={styles.statusItem}>Pendiente de confirmacion</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStatusChange('Canceled')}>
                <Text style={styles.statusItem}>Cancelado</Text>
              </TouchableOpacity>
            </View>
            <Button mode="contained" onPress={handleUpdateStatusConfirm} style={styles.button}>
              Actualizar Estado
            </Button>
            <Button mode="contained" onPress={() => setModalStatusVisible(false)} style={styles.button}>
              Cancelar
            </Button>
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  };
  const renderDiagnosticItem = ({ item }: { item: DiagnosticPoint }) => (
    <Card style={styles.diagnosticItem}>
      <Card.Content>
        <Text style={styles.diagnosticTime}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.diagnosticDescription}>{item.description}</Text>
        <Text style={styles.diagnosticNotes}>Notas: {item.notes}</Text>
        {item.multimediaFiles && item.multimediaFiles.length > 0 && (
          <FlatList
            data={item.multimediaFiles}
            keyExtractor={(fileUrl) => fileUrl}
            renderItem={({ item: fileUrl }) => (
              <TouchableOpacity onPress={() => handleImagePress(fileUrl)}>
                <AuthedImage fileUrl={fileUrl} />
              </TouchableOpacity>
            )}
            horizontal
          />
        )}
      </Card.Content>
    </Card>
  );
  
  if (showAddWorkOrder) {
    return <AddWorkOrder onBack={handleBackFromAddWorkOrder} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestor de Órdenes de Trabajo</Text>

        {isStaff && (
          <Button
            mode="contained"
            onPress={handleCreateWorkOrder}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Crear Orden de Trabajo
          </Button>
        )}

        {viewingDiagnostics ? (
          <View>
            <Button mode="contained" onPress={handleBackToWorkOrders} style={styles.button}>
              Volver a Órdenes
            </Button>
            <FlatList
              data={diagnostics}
              keyExtractor={(item) => item.id}
              renderItem={renderDiagnosticItem}
            />
          </View>
        ) : (
          <FlatList
            data={workOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderWorkOrderItem}
          />
        )}
      </View>
  
      <Modal visible={modalVisible} transparent={true}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            {selectedImage && (
              <AuthedImage fileUrl={selectedImage} style={styles.fullScreenImage} />
            )}
            <Button mode="text" onPress={closeModal}>
              Cerrar
            </Button>
          </Animated.View>
        </GestureDetector>
      </Modal>
      {renderUpdateStatusModal()}
    </GestureHandlerRootView>
  );
};
export default WorkOrderComponent;