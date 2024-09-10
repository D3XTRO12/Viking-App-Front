import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


interface DiagnosticPoint {
  id: number;
  timestamp: string;
  description: string;
  multimediaFiles: string[];
}

const WorkOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<DiagnosticPoint[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const scale = useSharedValue<number>(1);
  const focalX = useSharedValue<number>(0);
  const focalY = useSharedValue<number>(0);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://172.28.205.8:8080/diagnostic-points/by-work-order/${orderNumber}/client/${documentNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los puntos de diagnóstico');
      }
      const data: DiagnosticPoint[] = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Error fetching diagnostic points:', error);
    }
  };

  const handleImagePress = (fileUrl: string) => {
    setSelectedImage(fileUrl);
    setModalVisible(true);
    scale.value = withTiming(1); // Restablecer el zoom al abrir el modal
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Manejar el evento de gesto de zoom (pinch)
  const pinchGesture = Gesture.Pinch()
  .onBegin(() => {
    scale.value = scale.value;
    focalX.value = focalX.value;
    focalY.value = focalY.value;
  })
  .onChange((event) => {
    scale.value = scale.value * event.scale;
    
    // Calcula el nuevo enfoque usando solo focalX y focalY
    const newFocalX = 200 - (200 - focalX.value) * (event.focalX / event.focalX);
    const newFocalY = 200 - (200 - focalY.value) * (event.focalY / event.focalY);
    
    focalX.value = newFocalX;
    focalY.value = newFocalY;
  })
  .onEnd(() => {
    scale.value = withTiming(1);
    focalX.value = withTiming(0);
    focalY.value = withTiming(0);
  });

const pinchStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: scale.value },
    { translateX: focalX.value },
    { translateY: focalY.value },
  ],
}));

  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Orden de Trabajo</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de Orden"
          value={orderNumber}
          onChangeText={setOrderNumber}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Número de Documento del Cliente"
          value={documentNumber}
          onChangeText={setDocumentNumber}
          keyboardType="numeric"
        />

        <Button title="Buscar" onPress={handleSearch} color="#cc0000" />

        {diagnostics && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Puntos del Diagnóstico:</Text>
            <FlatList
              data={diagnostics}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.diagnosticItem}>
                  <Text style={styles.diagnosticTime}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                  <Text style={styles.diagnosticDescription}>{item.description}</Text>

                  {/* Mostrar imágenes asociadas */}
                  {item.multimediaFiles && item.multimediaFiles.length > 0 && (
                    <FlatList
                      data={item.multimediaFiles}
                      keyExtractor={(fileUrl) => fileUrl}
                      renderItem={({ item: fileUrl }) => (
                        <TouchableOpacity onPress={() => handleImagePress(fileUrl)}>
                          <Image
                            source={{ uri: fileUrl }}
                            style={styles.image}
                            resizeMode="cover"
                            onError={(error) => console.log('Error loading image:', error.nativeEvent.error)}
                          />
                        </TouchableOpacity>
                      )}
                      horizontal
                    />
                  )}
                </View>
              )}
            />
          </View>
        )}

        {/* Modal para mostrar la imagen a pantalla completa con pinch-to-zoom */}
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
            {selectedImage && (
              <GestureDetector gesture={pinchGesture}>
                <Animated.View style={[styles.imageContainer, pinchStyle]}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </GestureDetector>
            )}
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
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
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 10,
  },
  diagnosticItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  diagnosticTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  diagnosticDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#cc0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkOrder;
