// theme.ts (Usando MD3LightTheme)
import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#cc0000',  // Color principal personalizado
    accent: '#ff4081',   // Color secundario personalizado
    background: '#ffffff',
    surface: '#f1f1f1',
    text: '#333333',
    error: '#f13a59',
    // Agrega aquí cualquier otro color personalizado que desees
    primaryContainer: '#ffebee',
    secondary: '#616161',
    tertiary: '#9e9e9e',
    outline: '#808080',
    // ... otros colores ...
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '200',
    },
  },
  // Otras propiedades que puedes personalizar
  // shape property removed as it does not exist on MD3Theme
  animation: {
    ...MD3LightTheme.animation,
    scale: 1.0, // Personaliza la animación de escala
  },
  // ... otras propiedades que quieras personalizar
};

export { theme };
