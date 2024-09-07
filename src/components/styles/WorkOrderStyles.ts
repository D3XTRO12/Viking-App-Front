// components/styles/WorkOrderStyles.ts
import { StyleSheet } from 'react-native';

const colors = {
  background: '#f9f9f9', // Color de fondo general
  primary: '#cc0000', // Color primario para botones y acentos
  border: '#ddd', // Color de borde
  text: '#333', // Color de texto
  inputBackground: '#fff', // Color de fondo para inputs
  deviceItemBackground: '#f9f9f9', // Color de fondo para elementos de dispositivo
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    color: colors.text, // Color del texto de las etiquetas
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
    padding: 8,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
  },
  clientInfoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.background, // Color de fondo para la info del cliente
    borderRadius: 5,
  },
  clientInfoText: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text, // Color del texto de la info del cliente
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.deviceItemBackground,
  },
  selectedDeviceContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.background, // Color de fondo para el dispositivo seleccionado
    borderRadius: 5,
  },
});

export default styles;
