import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerContainer: {
      backgroundColor: '#007AFF',
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    sectionContainer: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 15,
    },
    multilineInput: {
      textAlignVertical: 'top',
      height: 100,
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    buttonText: {
      fontSize: 18,
      color: '#fff',
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
  });
export default styles;