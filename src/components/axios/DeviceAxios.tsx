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
      clientName: device.client.name, // Añadir esta línea
    }));
    setDevices(devices); // Asigna los dispositivos encontrados al estado
  } catch (error) {
    console.error('Error fetching devices by brand:', error);
    // Manejo de errores según sea necesario
  }
};
