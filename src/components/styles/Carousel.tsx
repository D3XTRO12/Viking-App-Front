import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { Card, Surface } from 'react-native-paper';

interface CarouselItem {
  id: string;
  image: number | string;
  label: string;
}

const Carousel = ({ items }: { items: CarouselItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = new Animated.Value(0);
  const width = 300; // Definir el ancho de la imagen

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (evt, gestureState) => {
      handleGestureEnd(gestureState);
    },
  });

  const handleGestureEnd = (gestureState: any) => {
    if (gestureState && gestureState.dx) {
      const translation = gestureState.dx;
      if (translation > 50 && activeIndex > 0) {
        // Deslizar a la izquierda (anterior imagen)
        setActiveIndex((prev) => prev - 1);
      } else if (translation < -50 && activeIndex < items.length - 1) {
        // Deslizar a la derecha (siguiente imagen)
        setActiveIndex((prev) => prev + 1);
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [{ translateX: translateX }],
  };

  return (
    <Surface style={{ elevation: 4, borderRadius: 8, overflow: 'hidden' }}>
      <Card>
        <View {...panResponder.panHandlers}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={typeof items[activeIndex].image === 'number' ? items[activeIndex].image : { uri: items[activeIndex].image }}
              style={styles.image}
            />
          </Animated.View>
        </View>

        <Card.Actions>
          {items.map((item, index) => (
            <View key={item.id} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: activeIndex === index ? '#007AFF' : '#333' }}>{item.label}</Text>
            </View>
          ))}
        </Card.Actions>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
});

export default Carousel;