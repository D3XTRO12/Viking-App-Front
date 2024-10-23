import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../../src/components/axios/Axios';
import AuthedImage from '../../../../src/components/types/AuthedImages';
import styles from '../../../../src/components/styles/Styles';

interface DiagnosticPoint {
  id: string;
  timestamp: number;
  description: string;
  multimediaFiles: string[];
  notes: string;
}

const ShowDiagnosticPoints: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticPoint[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { id: orderId, clientId } = useLocalSearchParams<{ id: string; clientId: string }>();

  useEffect(() => {
    if (orderId && clientId) {
      fetchDiagnosticPoints();
    }
  }, [orderId, clientId]);

  const fetchDiagnosticPoints = async () => {
    try {
      setLoading(true);
      const response = await api.get<DiagnosticPoint[]>(`/api/diagnostic-points/by-work-order/${orderId}/client/${clientId}`);
      setDiagnostics(response.data);
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
      Alert.alert('Error', 'No se pudieron obtener los puntos de diagnóstico.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = (fileUrl: string) => {
    setSelectedImage(fileUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderImageGrid = (files: string[]) => {
    return (
      <View style={styles.imageGrid}>
        {files.map((fileUrl, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(fileUrl)}
            style={styles.imageContainer}
          >
            <AuthedImage 
              fileUrl={fileUrl} 
              style={[styles.thumbnailImage, styles.imageWithBorder]} // Agregando el estilo de borde
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDiagnosticCard = ({ item }: { item: DiagnosticPoint }) => (
    <Card style={styles.diagnosticCard}>
      <Card.Content>
        <Text style={styles.diagnosticDate}>
          Fecha: {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <Text style={styles.diagnosticDescription}>
          Descripción: {item.description}
        </Text>
        <Text style={styles.diagnosticNotes}>
          Notas: {item.notes}
        </Text>
        
        {item.multimediaFiles && item.multimediaFiles.length > 0 && 
          renderImageGrid(item.multimediaFiles)
        }
      </Card.Content>
    </Card>
  );

  const renderDiagnosticsList = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando diagnósticos...</Text>
        </View>
      );
    }

    if (diagnostics.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text>No hay puntos de diagnóstico disponibles.</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.diagnosticsContainer}>
        <Button 
          mode="contained" 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Volver a Órdenes
        </Button>
  
        <FlashList
          data={diagnostics}
          renderItem={renderDiagnosticCard}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {renderDiagnosticsList()}
      
      <Modal 
        visible={modalVisible} 
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeModal}
        >
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.modalImage}
                resizeMode="contain"
                onError={(error) => console.log('Error loading image:', error.nativeEvent.error)}
              />
              <Button 
                mode="contained" 
                onPress={closeModal}
                style={styles.closeButton}
              >
                Cerrar
              </Button>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default ShowDiagnosticPoints;
