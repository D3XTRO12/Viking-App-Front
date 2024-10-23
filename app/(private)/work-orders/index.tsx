import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, Searchbar, Surface } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import api, { tokenService } from '../../../src/components/axios/Axios';
import { WorkOrder } from '../../../src/components/interfaces/WorkOrderInterface';
import { useAuth } from '../../../src/components/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import styles from '../../../src/components/styles/Styles';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { addEventListener } from '../../../src/components/events/events';

interface User {
  id: string;
  email: string;
  dni?: string;
  name: string;
}

const WorkOrders: React.FC = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orderId, setOrderId] = useState('');
  const [showAddWorkOrder, setShowAddWorkOrder] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [searchDni, setSearchDni] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<'dni' | 'staff' | 'all'>('all');
  const [originalWorkOrders, setOriginalWorkOrders] = useState<WorkOrder[]>([]);

  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initializeUserData();

    const subscription = addEventListener('refreshWorkOrders', () => {
      if (userId) {
        fetchWorkOrders(isStaff, userId);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [userId, isStaff]);

  const handleCreateWorkOrder = () => {
    router.push('/work-orders/add');
    setShowAddWorkOrder(true);
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
        const filteredWorkOrders = response.data.filter(
          (workOrder) =>
            workOrder.repairStatus === 'En Progreso' ||
            workOrder.repairStatus === 'Pendiente'
        );

        setWorkOrders(filteredWorkOrders);
        setOriginalWorkOrders(filteredWorkOrders);
      } else {
        throw new Error('Respuesta vacía o inválida del servidor');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSearchByDni = async () => {
    if (!searchDni.trim()) {
      Alert.alert('Error', 'Por favor ingrese un DNI válido');
      return;
    }

    setIsSearching(true);
    try {
      const userResponse = await api.get<User>(`/api/user/search?query=by-dni&dni=${searchDni}`);
      if (!userResponse.data) {
        Alert.alert('Error', 'No se encontró ningún usuario con ese DNI');
        return;
      }

      const ordersResponse = await api.get<WorkOrder[]>(
        `/api/work-order/search?query=by-clientid&clientId=${userResponse.data.id}`
      );

      const filteredOrders = ordersResponse.data.filter(
        (order) => order.repairStatus === 'En Progreso' || order.repairStatus === 'Pendiente'
      );

      setWorkOrders(filteredOrders);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchByStaffId = async () => {
    setIsSearching(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se encontró token de autenticación');
        return;
      }

      const decodedToken = jwtDecode<{ sub: string }>(token);
      const email = decodedToken.sub;

      const userResponse = await api.get<User>(`/api/user/search?query=by-email&email=${email}`);
      if (!userResponse.data) {
        Alert.alert('Error', 'No se encontró información del staff');
        return;
      }

      const ordersResponse = await api.get<WorkOrder[]>(
        `/api/work-order/search?query=by-staffid&staffId=${userResponse.data.id}`
      );

      const filteredOrders = ordersResponse.data.filter(
        (order) => order.repairStatus === 'En Progreso' || order.repairStatus === 'Pendiente'
      );

      setWorkOrders(filteredOrders);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setWorkOrders(originalWorkOrders);
    setSearchDni('');
    setSearchType('all');
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchTypeContainer}>
        <Button
          mode={searchType === 'all' ? 'contained' : 'outlined'}
          onPress={() => setSearchType('all')}
          style={styles.button}
          labelStyle={searchType === 'all' ? styles.selectedText : styles.unselectedText}
        >
          Todos
        </Button>
        <Button
          mode={searchType === 'dni' ? 'contained' : 'outlined'}
          onPress={() => setSearchType('dni')}
          style={styles.button}
          labelStyle={searchType === 'dni' ? styles.selectedText : styles.unselectedText}
          >
          DNI
        </Button>
        {isStaff && (
          <Button
            mode={searchType === 'staff' ? 'contained' : 'outlined'}
            onPress={() => setSearchType('staff')}
            style={styles.button}
            labelStyle={searchType === 'staff' ? styles.selectedText : styles.unselectedText}
            >
            Mis Órdenes
          </Button>
        )}
      </View>

      {searchType === 'dni' && (
        <View style={styles.searchInputContainer}>
          <Searchbar
            placeholder="Buscar por DNI..."
            onChangeText={setSearchDni}
            value={searchDni}
            style={styles.searchbar}
          />
          <Button 
            mode="contained" 
            onPress={handleSearchByDni}
            loading={isSearching}
            style={styles.searchButton}
          >
            Buscar
          </Button>
        </View>
      )}

      {searchType === 'staff' && (
        <Button 
          mode="contained" 
          onPress={handleSearchByStaffId}
          loading={isSearching}
          style={styles.button}
        >
          Ver Mis Órdenes
        </Button>
      )}

{searchType !== 'all' && (
  <Button
    mode="outlined"
    onPress={resetSearch}
    style={styles.button} // Puedes mantener el estilo de botón
    labelStyle={styles.unselectedText} // Solo asignamos el estilo de texto no seleccionado
  >
    Mostrar Todos
  </Button>
)}

    </View>
  );

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/api/work-order/${orderId}`, { repairStatus: newStatus });
      if (userId) {
        await fetchWorkOrders(isStaff, userId);
        Alert.alert('Éxito', 'Estado de la orden actualizado.');
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
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la orden de trabajo.');
    }
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

  const handleNavigateTodiagnosticPoints = async (workOrder: WorkOrder) => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        Alert.alert('Error', 'No hay sesión activa. Por favor, inicie sesión.');
        // Aquí podrías redirigir al login
        return;
      }
      
      router.push(`/work-orders/${workOrder.id}/show-diagnosticPoints?clientId=${workOrder.clientId}`);
    } catch (error) {
      console.error('Error navigating to diagnostic points:', error);
      Alert.alert('Error', 'No se pudo acceder a los diagnósticos');
    }
  };
  

  const renderWorkOrderItem = ({ item }: { item: WorkOrder }) => (
    <Surface style={styles.workOrderSurface}>
      <Card 
        style={[
          styles.workOrderItem,
          expandedOrderId === item.id && styles.workOrderItemExpanded
        ]}
      >
        <Card.Content>
          <TouchableOpacity 
            onPress={() => toggleExpandOrder(item.id)}
            style={styles.cardTouchable}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.orderIdText}>Orden N°: {item.id}</Text>
              <Text style={styles.statusText}>Estado: {item.repairStatus}</Text>
            </View>
          </TouchableOpacity>

          {expandedOrderId === item.id && isStaff && (
            <View style={styles.expandedContent}>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatusModal(item.id)}
                style={[styles.button, styles.actionButton]}
                labelStyle={styles.buttonText}
              >
                Actualizar Estado
              </Button>
              
              <Button
                mode="contained"
                onPress={() => handleDeleteOrder(item.id)}
                style={[styles.button, styles.actionButton]}
                labelStyle={styles.workOrderButtonText}
              >
                Eliminar
              </Button>
              
              <Button
                mode="contained"
                onPress={() => router.push(`/work-orders/${item.id}/add-diagnosticpoint`)}
                style={[styles.button, styles.actionButton]}
                labelStyle={styles.workOrderButtonText}
              >
                Agregar Diagnóstico
              </Button>
              
              <Button
                mode="contained"
                onPress={() => handleNavigateTodiagnosticPoints(item)}
                style={[styles.button, styles.actionButton]}
                labelStyle={styles.workOrderButtonText}
              >
                Ver Diagnósticos
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </Surface>
  );

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(prevId => (prevId === id ? null : id));
  };

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
                <Text style={styles.statusItem}>Pendiente de confirmación</Text>
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button 
        mode="contained" 
        onPress={handleCreateWorkOrder} 
        style={styles.button}
      >
        Crear Orden de Trabajo
      </Button>

      {renderSearchBar()}
      
      <FlashList
        data={workOrders}
        renderItem={renderWorkOrderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={200}
        extraData={expandedOrderId}
      />
      
      {renderUpdateStatusModal()}
    </GestureHandlerRootView>
  );
};

export default WorkOrders;