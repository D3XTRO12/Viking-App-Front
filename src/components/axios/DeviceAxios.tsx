import axios from 'axios';
import { Alert } from 'react-native';
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
    
    setDevices(response.data); // Asigna los dispositivos encontrados al estado
  } catch (error) {
    console.error('Error fetching devices by brand:', error);
    // Manejo de errores según sea necesario
  }
};