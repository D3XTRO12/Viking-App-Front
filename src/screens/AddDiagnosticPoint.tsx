import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ConfirmButton from '../components/buttons/ConfirmButton';
import styles from '../components/styles/DiagnosticPointStyles';


interface DiagnosticPoint {
  workOrder: {
    id: string;
  };
  timestamp: string;
  description: string;
  notes: string;
}

const AddDiagnosticPoint: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticPoint>({
    workOrder: { id: '' },
    timestamp: new Date().toISOString(),
    description: '',
    notes: ''
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitForm = async () => {
    try {
      const formData = new FormData();

      // Agregar el objeto diagnosticPoint como parte del FormData
      formData.append('diagnosticPoint', JSON.stringify(diagnosticData));

      // Agregar la imagen como archivo con nombre único
      if (imageUri) {
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const timestamp = new Date().getTime(); // Timestamp actual en milisegundos
        const uniqueFileName = `workOrder_${diagnosticData.workOrder.id}_${timestamp}.${fileType}`;

        formData.append('file', {
          uri: imageUri,
          name: uniqueFileName,
          type: `image/${fileType}`,
        } as any);
      }

      console.log('FormData:', formData);

      const response = await fetch('http://172.28.205.8:8080/auth/diagnostic-points/add', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resultado:', result);

      Alert.alert('Éxito', 'Diagnóstico enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar el diagnóstico. Por favor, inténtelo de nuevo.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Enviar Diagnóstico Informático</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información de la Orden de Trabajo</Text>
          <TextInput 
            placeholder="ID de la orden de trabajo"
            keyboardType="numeric"
            value={diagnosticData.workOrder.id}
            onChangeText={(text) => setDiagnosticData({ ...diagnosticData, workOrder: { ...diagnosticData.workOrder, id: text } })}
            style={styles.input}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Descripción del Problema</Text>
          <TextInput 
            placeholder="Descripción del problema"
            multiline={true}
            numberOfLines={4}
            value={diagnosticData.description}
            onChangeText={(text) => setDiagnosticData({ ...diagnosticData, description: text })}
            style={[styles.input, styles.multilineInput]}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notas Adicionales</Text>
          <TextInput 
            placeholder="Notas adicionales"
            multiline={true}
            numberOfLines={4}
            value={diagnosticData.notes}
            onChangeText={(text) => setDiagnosticData({ ...diagnosticData, notes: text })}
            style={[styles.input, styles.multilineInput]}
          />
        </View>

        <TouchableOpacity onPress={handleImagePicker} style={styles.button}>
          <Text style={styles.buttonText}>Seleccionar imagen</Text>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUri }}
              style={styles.imagePreview}
            />
          </View>
        )}

          <ConfirmButton title="Enviar diagnóstico" onPress={submitForm}/>
      </View>
    </ScrollView>
  );
};


export default AddDiagnosticPoint;