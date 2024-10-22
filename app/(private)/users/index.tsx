import React, { useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar, Menu, List, IconButton } from 'react-native-paper';
import { Link, router } from 'expo-router';
import api from '../../../src/components/axios/Axios';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dni: string;
}

export default function UsersIndex() {
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSearch = async () => {
    try {
      let endpoint = `/api/user/search?query=${searchType}`;
      if (searchType !== 'all' && searchQuery) {
        endpoint += `&${searchType.replace('by-', '')}=${searchQuery}`;
      }
      const response = await api.get(endpoint);
      setUsers(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('No se pudieron buscar los usuarios');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await api.delete(`/api/user/delete/${userId}`);
      alert('Usuario eliminado con éxito');
      handleSearch(); // Refrescar la lista después de eliminar
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('No se pudo eliminar el usuario');
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Usuarios" />
          <Link href="/users/create" asChild>
            <IconButton icon="plus" onPress={() => {}} />
          </Link>
      </Appbar.Header>
      <View style={{ flex: 1, padding: 16 }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {searchType === 'all' ? 'Todos' : searchType === 'by-email' ? 'Email' : 'DNI'}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setSearchType('all'); setMenuVisible(false); }} title="Todos" />
          <Menu.Item onPress={() => { setSearchType('by-email'); setMenuVisible(false); }} title="Por Email" />
          <Menu.Item onPress={() => { setSearchType('by-dni'); setMenuVisible(false); }} title="Por DNI" />
        </Menu>

        {searchType !== 'all' && (
          <TextInput
            label="Término de búsqueda"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
          />
        )}

        <Button mode="contained" onPress={handleSearch} style={{ marginVertical: 10 }}>
          Buscar
        </Button>

        <FlashList
          data={users}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Email: ${item.email}\nDNI: ${item.dni}\nTeléfono: ${item.phoneNumber}`}
              right={props => (
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    onPress={() => router.push(`/users/${item.id}/edit`)}
                  />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              )}
            />
          )}
          estimatedItemSize={100}
        />
      </View>
    </PaperProvider>
  );
}