import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../components/styles/Styles';
import CreateUser from './CreateUser';
import ReadUsers from './ReadUsers';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';

type ScreenMode = 'main' | 'create' | 'read' | 'update' | 'delete';

const HandleUsers: React.FC = () => {
  const [screenMode, setScreenMode] = useState<ScreenMode>('main');

  const renderScreen = () => {
    switch (screenMode) {
      case 'create':
        return <CreateUser onBack={() => setScreenMode('main')} />;
      case 'read':
        return <ReadUsers onBack={() => setScreenMode('main')} />;
      case 'update':
         return <EditUser onBack={() => setScreenMode('main')} />;
      case 'delete':
         return <DeleteUser onBack={() => setScreenMode('main')} />;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Gestión de Usuarios</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setScreenMode('create')} style={[styles.crudButton, { backgroundColor: '#cc0000' }]}>
                <Text style={styles.buttonText}>Crear Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScreenMode('read')} style={[styles.crudButton, { backgroundColor: '#cc0000' }]}>
                <Text style={styles.buttonText}>Buscar Usuarios</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScreenMode('update')} style={[styles.crudButton, { backgroundColor: '#cc0000' }]}>
                <Text style={styles.buttonText}>Actualizar Datos de Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScreenMode('delete')} style={[styles.crudButton, { backgroundColor: '#cc0000' }]}>
                <Text style={styles.buttonText}>Eliminar Usuario</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return renderScreen();
};

export default HandleUsers;