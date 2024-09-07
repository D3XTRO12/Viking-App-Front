import axios from 'axios';
import { Alert } from 'react-native';
import { ClientInterface} from '../interfaces/ClientInterface';

const baseURL = 'http://172.28.205.8:8080';

export const searchClient = async (dni: string, setFoundClient: (client: ClientInterface | null) => void) => {
  try {
    const response = await axios.get(`${baseURL}/client/search`, {
      params: {
        dni: dni,
        query: 'by-dni',
      },
    });
    if (response.status === 200) {
      setFoundClient(response.data);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log('Client not found with DNI:', dni);
      setFoundClient(null);
      alert('No se encontró ningún cliente con ese DNI.');
    } else {
      console.log('Error fetching client by DNI:', error);
      alert('Ocurrió un problema al buscar el cliente.');
    }
  }
};
export const saveClient = async (clientData: {
  name: string;
  dni: number;
  address: string;
  phoneNumber: string;
  secondaryPhoneNumber: string | null;
}) => {
  try {
    const response = await axios.post(`${baseURL}/client/save`, clientData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error al agregar el cliente:', error);
    Alert.alert('Error', 'Hubo un problema al agregar el cliente');
    return false;
  }
};

