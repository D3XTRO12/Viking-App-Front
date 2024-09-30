import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../images/icons/LOGO.png')} style={styles.backgroundImage} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Nuestro Negocio</Text>
        <Text style={styles.description}>
          Nos dedicamos a la reparación de computadoras, soporte de software (instalación de programas y sistemas operativos
          GNU/LINUX y Windows), asesoramiento en compra de componentes y computadoras completas, y servicios completos a consolas.
        </Text>
        <Text style={styles.subtitle}>Fotos de nuestros trabajos</Text>
        <View style={styles.photosContainer}>
          <Image source={require('../images/trabajo1.jpg')} style={styles.photo} />
          <Image source={require('../images/trabajo2.jpeg')} style={styles.photo} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.5,
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: -1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 10,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default Home;
