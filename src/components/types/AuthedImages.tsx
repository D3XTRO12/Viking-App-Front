// import React, { useState, useEffect } from 'react';
// import { Image, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
// import api from '../axios/Axios';

// interface AuthedImageProps {
//   fileUrl: string | null;
//   onClose?: () => void;
//   style?: any;
// }

// const AuthedImage: React.FC<AuthedImageProps> = ({ fileUrl, onClose, style }) => {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchImage = async () => {
//       if (!fileUrl) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         console.log('Fetching image from:', fileUrl);

//         // Si la URL contiene '/auth/', usar directamente sin token
//         if (fileUrl.includes('/auth/')) {
//           setImageUri(fileUrl);  // Usar directamente la URL
//           setLoading(false);
//           return;
//         }

//         // Para otras rutas, verificar el token y usar axios
//         const token = await api.defaults.headers.common['Authorization'];
//         if (!token) {
//           throw new Error('No authorization token available');
//         }

//         const response = await api.get(fileUrl, {
//           responseType: 'blob',
//           headers: {
//             'Accept': 'image/jpeg, image/png, image/*',
//             'Cache-Control': 'no-cache',
//             'Authorization': token,
//           },
//         });
        
//         if (!response?.data) {
//           throw new Error('No image data received');
//         }

//         const blob = response.data;
//         console.log('Image Blob received:', blob);

//         if (!blob.type.startsWith('image/')) {
//           throw new Error('Response is not an image');
//         }

//         // Convertir blob a una URL de objeto y usar directamente
//         const imageObjectUrl = URL.createObjectURL(blob);
//         setImageUri(imageObjectUrl);
//         setLoading(false);

//       } catch (error) {
//         console.error('Error fetching image:', error);
//         setError(`Failed to load image: ${(error as Error).message}`);
//         setLoading(false);
//       }
//     };

//     fetchImage();

//     // Cleanup function para revocar la URL del objeto cuando ya no se use
//     return () => {
//       if (imageUri) {
//         URL.revokeObjectURL(imageUri);
//       }
//     };
//   }, [fileUrl]);

//   if (!fileUrl) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       )}
      
//       {error && (
//         <View style={[styles.errorContainer, style]}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       )}
      
//       {!loading && !error && imageUri && (
//         <Image 
//           source={{ uri: imageUri }} 
//           style={[styles.image, style]}
//           onError={(e) => {
//             console.error('Image rendering error:', e.nativeEvent.error);
//             setError('Error displaying image');
//           }}
//           resizeMode="cover"  // Puedes cambiar esto si es necesario
//         />
//       )}
      
//       {!loading && !error && !imageUri && (
//         <Image 
//           source={require('../../images/icons/LOGO.png')} 
//           style={[styles.image, style]}
//           resizeMode="contain"
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   image: {
//     width: 100,
//     height: 100,
//     margin: 5,
//     backgroundColor: '#f5f5f5',
//   },
//   errorContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8d7da',
//     borderColor: '#f5c6cb',
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 5,
//     minWidth: 100,
//     minHeight: 100,
//   },
//   errorText: {
//     color: '#721c24',
//     textAlign: 'center',
//   },
// });

// export default AuthedImage;

import React from 'react';
import { Image, ImageProps } from 'react-native';

interface AuthedImageProps extends ImageProps {
  fileUrl: string;
}

const AuthedImage: React.FC<AuthedImageProps> = ({ fileUrl, style, resizeMode }) => {
  // Aquí podrías incluir lógica adicional para manejo de autorización si es necesario
  return <Image source={{ uri: fileUrl }} style={style} resizeMode={resizeMode} />;
};

export default AuthedImage;
