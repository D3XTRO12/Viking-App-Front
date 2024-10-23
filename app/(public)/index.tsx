import React from 'react';
import { Image, Dimensions, View } from 'react-native';
import { Card, Title, Paragraph, Text as PaperText } from 'react-native-paper'; // Cambié Text por PaperText
import { FlashList } from '@shopify/flash-list';
import styles from '../../src/components/styles/Styles';
import Carousel from '../../src/components/styles/Carousel';

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
            source={require('../../src/images/icons/LOGO.png')}
            style={{ width, height: height * 0.4, opacity: 1 }}
          />
        );
      case 'text':
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Nuestro Negocio</Title>
              <Paragraph>
                <PaperText>
                  Nos dedicamos a la reparación de computadoras, soporte de software, asesoramiento en compra de componentes y servicios completos a consolas.
                </PaperText>
              </Paragraph>
            </Card.Content>
          </Card>
        );
      case 'photo':
        return (
          <View style={{ marginVertical: 16 }}>
            {/* Asegúrate de usar PaperText o Text para renderizar texto */}
            <PaperText style={styles.subtitle}>Fotos de nuestros trabajos</PaperText>
            <Carousel
              items={[
                { id: 'before', image: require('../../src/images/trabajo1.jpg'), label: 'Antes' },
                { id: 'after', image: require('../../src/images/trabajo2.jpeg'), label: 'Después' },
              ]}
            />
          </View>
        );
    }
  };

  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      estimatedItemSize={height / 5}
      contentContainerStyle={{ paddingVertical: 16 }}
    />
  );
};

export default Home;
