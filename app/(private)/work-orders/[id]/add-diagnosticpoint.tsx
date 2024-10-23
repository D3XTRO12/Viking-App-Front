import React, { useState } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet } from 'react-native';
import ConfirmButton from '../../../../src/components/buttons/ConfirmButton';
import styles from '../../../../src/components/styles/Styles';
import { useAuth } from '../../../../src/components/context/AuthContext';
import api from '../../../axios/Axios';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Importa useRoute

interface DiagnosticPoint {
  workOrder: { id: string };
  timestamp: string;
  description: string;
  notes: string;
  image?: string;
}

interface ListItem {
  type: string;
  data: any;
}

type Section = {
  id: string;
  type: 'description' | 'notes' | 'imagePicker' | 'imagePreview';
  component: React.ReactElement;
};

type ListData = [...ListItem[]];

const AddDiagnosticPoint: React.FC = () => {
  const { user, getToken } = useAuth();
  const route = useRouter(); // Usa useRoute para acceder a la ruta actual
  const { id: workOrderId } = useLocalSearchParams();

  const [diagnosticData, setDiagnosticData] = useState<DiagnosticPoint>({
    workOrder: { id: Array.isArray(workOrderId) ? workOrderId[0] : workOrderId || '' },
    timestamp: new Date().toISOString(),
    description: '',
    notes: ''
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setDiagnosticData({ ...diagnosticData, image: uri });
    }
  };

  const submitForm = async () => {
    if (!diagnosticData.description || !diagnosticData.notes) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const token = await getToken();
      const formData = new FormData();
      const diagnosticPoint = {
        workOrder: { id: diagnosticData.workOrder.id },
        timestamp: diagnosticData.timestamp,
        description: diagnosticData.description,
        notes: diagnosticData.notes
      };

      formData.append('diagnosticPoint', JSON.stringify(diagnosticPoint));

      if (imageUri) {
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const uniqueFileName = `workOrder_${diagnosticData.workOrder.id}_${Date.now()}.${fileType}`;

        formData.append('file', {
          uri: imageUri,
          name: uniqueFileName,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await api.post('/api/diagnostic-points/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      if (response && response.status === 200) {
        Alert.alert('Éxito', 'Diagnóstico enviado con éxito');
      } else {
        throw new Error(`Error en la solicitud: ${response ? response.status : 'No response'}`);
      }
    } catch (apiError: any) {
      console.error('Error en la llamada API:', apiError);
      Alert.alert('Error', `No se pudo enviar el diagnóstico. ${apiError.message}`);
    }
  };

  const getSections = (): Section[] => [
    {
      id: 'description',
      type: 'description',
      component: (
        <View style={styles.flashListContainer}>
          <Text style={styles.sectionTitle}>Descripción del Problema</Text>
          <TextInput
            placeholder="Descripción del problema"
            multiline
            value={diagnosticData.description}
            onChangeText={(text) => setDiagnosticData({ ...diagnosticData, description: text })}
            style={styles.input}
          />
        </View>
      )
    },
    {
      id: 'notes',
      type: 'notes',
      component: (
        <View style={styles.flashListContainer}>
          <Text style={styles.sectionTitle}>Notas Adicionales</Text>
          <TextInput
            placeholder="Notas adicionales"
            multiline
            value={diagnosticData.notes}
            onChangeText={(text) => setDiagnosticData({ ...diagnosticData, notes: text })}
            style={styles.input}
          />
        </View>
      )
    },
    {
      id: 'imagePicker',
      type: 'imagePicker',
      component: (
        <Button mode="contained" onPress={handleImagePicker} style={styles.button}>
          Seleccionar imagen
        </Button>
      )
    },
    {
      id: 'imagePreview',
      type: 'imagePreview',
      component: imageUri ? (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.imagePreview}
          />
        </View>
      ) : (<View />)
    }
  ];

  return (
    <View style={styles.container}>
      <FlashList
        data={getSections()}
        renderItem={({ item }) => (
          <View style={additionalStyles.sectionContainer}>
            {item.component}
          </View>
        )}
        estimatedItemSize={200}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={additionalStyles.listContainer}
      />
      
      <View style={additionalStyles.submitButtonContainer}>
        <ConfirmButton onPress={submitForm} title="Enviar Diagnóstico" />
      </View>
    </View>
  );
};

// Estilos adicionales
const additionalStyles = StyleSheet.create({
  submitButtonContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionContainer: {
    marginBottom: 16,
  },
});

export default AddDiagnosticPoint;
