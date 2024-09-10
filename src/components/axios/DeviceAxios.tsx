import axios from 'axios';
import { DeviceInterface } from '../interfaces/DeviceInterface';

const baseURL = 'http://172.28.205.8:8080';

export const searchDevices = async (brand: string, setDevices: React.Dispatch<React.SetStateAction<DeviceInterface[]>>) => {
  try {
    const response = await axios.get(`${baseURL}/device/search`, {
      params: {
        query: 'by-brand',
        brand: brand,
      },
    });
    console.log('Devices found:', response.data);

    // Mapeamos la respuesta para adaptarla a DeviceInterface
    const devices: DeviceInterface[] = response.data.map((device: any) => ({
      id: device.id,
      serialNumber: device.serialNumber,
      brand: device.brand,
      model: device.model,
      type: device.type,
      clientId: device.client.id,
      clientName: device.client.name,
    }));
    setDevices(devices); // Asigna los dispositivos encontrados al estado
  } catch (error) {
    console.error('Error fetching devices by brand:', error);
    // Manejo de errores según sea necesario
  }
};

export const saveDevice = async (deviceData: Omit<DeviceInterface, 'id' | 'clientName'>) => {
  try {
    // Creamos el payload con la estructura exacta que espera el servidor
    const payload = {
      type: deviceData.type,
      brand: deviceData.brand,
      model: deviceData.model,
      serialNumber: deviceData.serialNumber,
      client: { id: deviceData.clientId } // Cambiamos clientId por un objeto client con id
    };

    console.log('Sending device data:', JSON.stringify(payload));

    const response = await axios.post(`${baseURL}/device/save`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Device saved:', response.data);

    if (response.status === 201 || response.status === 200) {
      return true; // Indica que el dispositivo se guardó exitosamente
    } else {
      console.error('Error saving device:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Error saving device:', error);
    return false;
  }
};

