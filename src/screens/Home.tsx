import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import styles from '../components/styles/Styles';
import Carousel from '../components/styles/Carousel';
import { cardio } from 'ldrs';

const { width, height } = Dimensions.get('window');

interface Item {
  id: string;
  type: 'image' | 'text' | 'photo';
}

const Home = () => {
  const items: Item[] = [
    { id: 'header', type: 'image' },
    { id: 'businessDescription', type: 'text' },
    { id: 'photosHeader', type: 'photo' }, // Combinar fotos en un único ítem
  ];

  const renderItem = ({ item }: { item: Item }) => {
    switch (item.type) {
      case 'image':
        return (
          <Image
            source={require('../images/icons/LOGO.png')}
            style={{ width, height: height * 0.4, opacity: 1 }}
          />
        );
      case 'text':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Nuestro Negocio</Title>
              <Paragraph>
                Nos dedicamos a la reparación de computadoras, soporte de software, asesoramiento en compra de componentes y servicios completos a consolas.
              </Paragraph>
            </Card.Content>
          </Card>
        );
      case 'photo':
        return (
          <View style={{ marginVertical: 16 }}>
            <Text style={styles.subtitle}>Fotos de nuestros trabajos</Text>
            <Carousel
              items={[
                { id: 'before', image: require('../images/trabajo1.jpg'), label: 'Antes' },
                { id: 'after', image: require('../images/trabajo2.jpeg'), label: 'Después' },
              ]}
            />
          </View>
        );
    }
  };

  return (
    <>
     <FlashList
        data={items}
        renderItem={renderItem}
        estimatedItemSize={height / 5}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </>
  );
};

export default Home;
