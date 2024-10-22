import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import api from '../axios/Axios';

interface AuthedImageProps {
  fileUrl: string | null;
  onClose?: () => void;
  style?: any;
}
const AuthedImage: React.FC<AuthedImageProps> = ({ fileUrl, onClose, style }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!fileUrl) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching image from:', fileUrl);
        const response = await api.get(fileUrl, {
          responseType: 'blob',
        });
        
        if (response && response.data) {
          const blob = response.data;
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            setImageUri(dataUrl);
          };
          reader.onerror = (e) => {
            console.error('FileReader error:', e);
            setError('Error processing image');
          };
          reader.readAsDataURL(blob);
        } else {
          throw new Error('No image data received');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setError(`Failed to load image: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [fileUrl]);

  if (!fileUrl) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, style]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.image, style]} />
      ) : (
        <Image source={require('../../images/icons/LOGO.png')} style={[styles.image, style]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#721c24',
    textAlign: 'center',
  },
});

export default AuthedImage;