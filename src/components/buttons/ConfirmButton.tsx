import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ConfirmButtonProps {
  title: string;         // Título del botón
  onPress: () => void;  // Función que se ejecuta al presionar el botón
  style?: object;       // Estilo adicional opcional
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#28a745', // Color verde para indicar confirmación
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff', // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmButton;
