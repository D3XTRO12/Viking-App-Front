import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');


const colors = {
  background: '#000', // Fondo negro
  primary: '#cc0000', // Color primario para botones y acentos (rojo)
  secondary: '#D3D3D3', // Color gris para el casco
  border: '#C20200', // Color de borde
  text: '#ffffff', // Color de texto en blanco para contraste
  inputBackground: '#333', // Color de fondo para inputs en gris oscuro
  deviceItemBackground: '#847f7e', // Color de fondo para elementos de dispositivo
};
const styles = StyleSheet.create({
  workOrdersScrollView: {
    maxHeight: 300, // Ajusta esta altura según tus necesidades
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  imagePreviewContainer: {
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    width: 200,  // Ajusta el tamaño según sea necesario
    height: 200, // Ajusta el tamaño según sea necesario
  },

  clientInfoContainer: {
    backgroundColor: '#222', // Fondo gris oscuro para la información del cliente
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  clientInfoText: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: "white", // Color del texto de la info del cliente
  },
  deviceItem: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    padding: 10,
    backgroundColor: '#444', // Fondo gris oscuro para los items de dispositivos
    borderRadius: 4,
    marginBottom: 8,
  },
    headerContainer: {
      backgroundColor: '#007AFF',
      paddingVertical: 20,
    },

    searchTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
  
    searchTypeButton: {
      flex: 1,
      marginHorizontal: 4,
    },
  
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  
    searchbar: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
  

    formContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    imageLink: {
      color: 'blue', // Cambia esto a cualquier color que prefieras
      textDecorationLine: 'underline',},
    flashListSectionContainer: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
      height: 300, width: '100%'
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff', // Fondo blanco para inputs
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 16,
    },
    multilineInput: {
      textAlignVertical: 'top',
      height: 100,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    imageContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    imagePreview: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
  selectedWorkOrderItem: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  selectedWorkOrderText: {
    fontWeight: 'bold',
  },
  unselectedWorkOrderItem: {
    backgroundColor: 'gray', // Estilo para no seleccionado
  },
  unselectedWorkOrderText: {
    color: 'black', // Color del texto cuando no está seleccionado
  },
  selectedDeviceContainer: {
    backgroundColor: colors.background, // Color de fondo para el dispositivo seleccionado
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    color: '#fff', // Texto blanco para el Picker
    backgroundColor: '#444', // Fondo gris oscuro para el Picker
    borderWidth: 1,
    borderRadius: 25, // Aumenta el valor para bordes más redondeados
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff', // Texto blanco para etiquetas
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
    justifyContent: 'center',
    alignItems: 'center',
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
  workOrderSurface: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  workOrderItemExpanded: {
    backgroundColor: '#f5f5f5',
  },
  
  cardTouchable: {
    padding: 8,
  },
  
  orderIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  
  expandedContent: {
    marginTop: 16,
    gap: 8,
  },
  
  actionButton: {
    marginVertical: 4,
  },
  workOrderItem: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
buttonContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},
crudButton: {
  backgroundColor: '#4CAF50',
  padding: 28.8,  // Aumenta el padding en un 20%
  borderRadius: 10,  // Cambiar a 50 si quieres hacerlos circulares
  margin: 12,  // Ajusta el margen para más separación entre botones
  width: 144,  // Aumenta el ancho en un 20%
  height: 144,  // Aumenta la altura en un 20%
  justifyContent: 'center',
  alignItems: 'center',
},
searchContainer: {
  marginBottom: 20,
},
searchButton: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  minWidth: 100,
},
selectedClientMessage: {
  marginTop: 10,
  fontSize: 16,
  color: 'green', // Puedes cambiar el color según tu preferencia
},

backButton: {
  backgroundColor: '#333', // Botón oscuro (gris oscuro/negro)
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 5,
  marginBottom: 25,
},
workOrderText: {
  fontSize: 14,
  marginBottom: 5,
},
backButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
userInfo: {
  marginTop: 20,
  fontSize: 16,
  textAlign: 'center',
},
flashListContainer: {
  padding: 16, // Por ejemplo, añade padding o margin
  backgroundColor: 'white', // Cambia el color de fondo o cualquier otro estilo
},
statusList: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  marginBottom: 20,
  width: '80%',
},
statusItem: {
  fontSize: 16,
  padding: 10,
  textAlign: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
  color: '#000',
},
content: {
  padding: 20,
},

logo: {
  width: 175,  // Ajusta el ancho del logo según tu diseño
  height: 175, // Ajusta la altura del logo según tu diseño
  alignSelf: 'center', // Centra el logo
  marginBottom: 1, // Espacio debajo del logo
},
backgroundImage: {
  position: 'absolute',
  width: width,
  height: height * 0.3,
  opacity: 0.2,
},
overlay: {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  ...StyleSheet.absoluteFillObject,
  zIndex: -1,
},
card: {
  margin: 20,
  width: '90%',
  backgroundColor: colors.deviceItemBackground
},

description: {
  fontSize: 16,
  color: '#666',
},
subtitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#cc0000',
  marginVertical: 20,
  alignSelf: 'center',
},
photosContainer: {
  flexDirection: 'row',
  paddingHorizontal: 20,
},
photoCard: {
  marginHorizontal: 10,
  elevation: 3,
},
photo: {
  width: 120,
  height: 120,
  borderRadius: 10,
},
confirmButton: {
  backgroundColor: '#d32f2f', // Botón rojo basado en el logo
  paddingVertical: 10,
  borderRadius: 5,
  alignItems: 'center',
  marginVertical: 10,
},
button: {
  borderRadius: 5,
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  margin: 5,
  backgroundColor: '#d32f2f', // Rojo que concuerda con el contorno del logo
},
buttonText: {
  color: '#fff', // Color blanco para el texto del botón
  fontWeight: 'bold',
  fontSize: 16,
},
passwordInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 15,
},
passwordToggle: {
  marginLeft: 10,
},
diagnosticItem: {
  marginVertical: 10,
  borderRadius: 10,
  backgroundColor: '#2c2c2c',
  padding: 15,
},
diagnosticTime: {
  fontWeight: 'bold',
  marginBottom: 5,
  color: '#fff',
},
diagnosticDescription: {
  fontSize: 16,
  marginBottom: 5,
  color: '#fff',
},
diagnosticNotes: {
  fontStyle: 'italic',
  marginBottom: 10,
  color: '#fff',
},

fullScreenImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
},
resetButton: {
  marginTop: 8,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: colors.secondary, // Gris del casco
  textAlign: 'center',
  textShadowColor: colors.primary, // Contorno rojo
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 5,
},
workOrderButton: {
    paddingVertical: 8,  // Reduce el padding vertical
    paddingHorizontal: 16,  // Reduce el padding horizontal
    fontSize: 14,  // Ajusta el tamaño del texto
    borderRadius: 5,  // Mantén un borde redondeado
    marginVertical: 5,  // Añade algo de espacio entre los botones
    alignSelf: 'flex-start',  // Ajusta el tamaño al contenido
  },
   workOrderButtonText: {
     color: '#fff',
     fontWeight: 'bold',
   },
   container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Fondo negro
  },
  sectionTitle: {
    color: 'black', // Títulos de sección en blanco
    fontSize: 20,
    marginBottom: 8,
  },
  //work orders styles
  diagnosticsContainer: {
    flex: 1,
    padding: 16,
  },
  diagnosticCard: {
    marginBottom: 16,
    elevation: 2,
  },
  diagnosticDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  //dg styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: "contain"
  },

  closeButton: {
    marginTop: 10,
  },
  imageWithBorder: {
    borderWidth: 2, // Grosor del borde
    borderColor: '#cc0000', // Color del borde (puedes cambiarlo a lo que desees)
    borderRadius: 8, // Para bordes redondeados, si lo prefieres
  },

});
export default styles;