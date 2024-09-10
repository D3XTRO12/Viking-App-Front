import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
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
      marginBottom: 20,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
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
  });
  export default styles;