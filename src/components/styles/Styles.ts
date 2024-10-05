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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25, // Aumenta el valor para bordes más redondeados
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  // Nuevos estilos
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  
  createButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  technicianItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  
buttonContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},
crudButton: {
  backgroundColor: '#007bff',
  padding: 28.8,  // Aumenta el padding en un 20%
  borderRadius: 10,  // Cambiar a 50 si quieres hacerlos circulares
  margin: 12,  // Ajusta el margen para más separación entre botones
  width: 144,  // Aumenta el ancho en un 20%
  height: 144,  // Aumenta la altura en un 20%
  justifyContent: 'center',
  alignItems: 'center',
},
buttonText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 16,  
},
searchContainer: {
  marginBottom: 20,
},
searchButton: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
},
selectedClientMessage: {
  marginTop: 10,
  fontSize: 16,
  color: 'green', // Puedes cambiar el color según tu preferencia
},

backButton: {
  backgroundColor: '#17a2b8',  // Un color distintivo pero que sigue la misma paleta de Bootstrap (info color)
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 5,
  marginBottom: 25,
},
backButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});

export default styles;