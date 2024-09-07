import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image } from 'react-native';

interface DiagnosticPoint {
  id: number;
  timestamp: string; // Cambiar a Date si necesitas trabajar con objetos Date
  description: string;
  multimediaFiles: string[]; // Array de URLs de archivos multimedia
}

const WorkOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<DiagnosticPoint[] | null>(null);

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

  return (
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
                      <Image
                        source={{ uri: fileUrl }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={(error) => console.log('Error loading image:', error.nativeEvent.error)}
                      />
                    )}
                    horizontal
                  />
                )}
              </View>
            )}
          />
        </View>
      )}
    </View>
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
});

export default WorkOrder;
