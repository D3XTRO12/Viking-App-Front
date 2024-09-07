import axios from 'axios';
import { Alert } from 'react-native';
import { ClientInterface } from '../interfaces/ClientInterface';
import { DeviceInterface } from '../interfaces/DeviceInterface';

const baseURL = 'http://172.28.205.8:8080';

export const saveWorkOrder = async (
    description: string,
    foundClient: ClientInterface | null,
    selectedDevice: DeviceInterface | null,
    staffId: string,
    repairStatus: string,
    resetForm: () => void
): Promise<boolean> => {
    // Validaciones iniciales
    if (!foundClient) {
        Alert.alert('Error', 'No se ha seleccionado un cliente.');
        return false; // Retorna false si no hay cliente
    }

    if (!selectedDevice || staffId === '' || repairStatus === '') {
        Alert.alert('Error', 'Por favor, complete todos los campos antes de crear la orden');
        return false; // Retorna false si faltan campos
    }

    try {
        // Llamada a la API
        const response = await axios.post(`${baseURL}/work-order/save`, {
            issueDescription: description,
            client: { dni: foundClient.dni },
            staff: { id: parseInt(staffId) },
            deviceId: { id: selectedDevice.id },
            repairStatus: repairStatus
        });

        // Verificación de respuesta
        if (response.status === 200) {
            Alert.alert('Éxito', 'Orden de trabajo creada correctamente');
            resetForm(); // Resetear formulario
            return true; // Retorna true si la creación fue exitosa
        } else {
            Alert.alert('Error', 'No se pudo crear la orden de trabajo');
            return false; // Retorna false si hubo un error
        }
    } catch (error) {
        console.error('Error al crear la orden de trabajo:', error);
        Alert.alert('Error', 'Hubo un problema al crear la orden de trabajo');
        return false; // Retorna false si ocurrió una excepción
    }
};
