import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

interface DiagnosticPoint {
  id: number;
  timestamp: string;
  description: string;
  multimediaFiles: string[];
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WorkOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<DiagnosticPoint[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const scale = useSharedValue<number>(1);
  const savedScale = useSharedValue<number>(1);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const focusX = useSharedValue<number>(0);
  const focusY = useSharedValue<number>(0);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://172.28.205.8:8080/auth/diagnostic-points/by-work-order/${orderNumber}/client/${documentNumber}`, {
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
    resetZoom();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    resetZoom();
  };

  const resetZoom = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
  };

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      focusX.value = event.focalX;
      focusY.value = event.focalY;
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(savedScale.value * event.scale, 1);
      translateX.value = event.focalX - focusX.value;
      translateY.value = event.focalY - focusY.value;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value += event.translationX;
      translateY.value += event.translationY;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
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
              <GestureDetector gesture={composed}>
                <Animated.View style={[styles.imageContainer, animatedStyle]}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 1,
  },
  closeButtonText: {
    color: '#cc0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkOrder;
