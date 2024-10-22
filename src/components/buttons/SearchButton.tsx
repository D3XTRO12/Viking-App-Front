import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchButtonProps {
  title: string;
  onPress: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', // Cambia este color según tu paleta
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchButton;
