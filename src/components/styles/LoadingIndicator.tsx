import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
