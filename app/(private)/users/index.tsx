import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar, Menu, List, IconButton } from 'react-native-paper';
import { Link, router } from 'expo-router';
import api from '../../axios/Axios';
import styles from '../../../src/components/styles/Styles';
import SectionListWrapper from '../../../src/components/wrappers-sections/SectionListWrapper';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dni: string;
}

interface SearchSectionProps {
  searchType: string;
  searchQuery: string;
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  setSearchType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchType,
  searchQuery,
  menuVisible,
  setMenuVisible,
  setSearchType,
  setSearchQuery,
  handleSearch
}) => (
  <>
    <Text style={styles.label}>Tipo de búsqueda</Text>
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button 
          onPress={() => setMenuVisible(true)} 
          mode="outlined" 
          style={styles.button}
          labelStyle={styles.selectedText}
        >
          {searchType === 'all' ? 'Todos' : searchType === 'by-email' ? 'Email' : 'DNI'}
        </Button>
      }
    >
      <Menu.Item onPress={() => { setSearchType('all'); setMenuVisible(false); }} title="Todos" />
      <Menu.Item onPress={() => { setSearchType('by-email'); setMenuVisible(false); }} title="Por Email" />
      <Menu.Item onPress={() => { setSearchType('by-dni'); setMenuVisible(false); }} title="Por DNI" />
    </Menu>

    {searchType !== 'all' && (
      <>
        <Text style={styles.label}>Término de búsqueda</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Ingrese término de búsqueda"
        />
      </>
    )}

    <Button
      mode="contained"
      onPress={handleSearch}
      style={styles.button}
      labelStyle={styles.selectedText}
    >
      Buscar
    </Button>
  </>
);

const UserList: React.FC<{ users: User[], handleDelete: (id: string) => void }> = ({ users, handleDelete }) => (
  <View style={styles.container}>
    <FlashList
      data={users}
      renderItem={({ item }) => (
        <List.Item
          title={<Text style={styles.title}>{item.name}</Text>}
          description={() => (
            <View style={styles.clientInfoContainer}>
              <Text style={styles.clientInfoText}>Email: {item.email}</Text>
              <Text style={styles.clientInfoText}>DNI: {item.dni}</Text>
              <Text style={styles.clientInfoText}>Teléfono: {item.phoneNumber}</Text>
            </View>
          )}
          right={props => (
            <View style={styles.actionButtons}>
              <IconButton
                icon="pencil"
                onPress={() => router.push(`/users/${item.id}/edit`)}
                style={styles.iconButton}
              />
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)}
                style={styles.iconButton}
              />
            </View>
          )}
          style={styles.deviceItem}
        />
      )}
      estimatedItemSize={100}
    />
  </View>
);

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
      handleSearch();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el usuario seleccionado');
    }
  };

  const sections = [
    {
      title: 'Búsqueda de Usuarios',
      data: [
        {
          key: 'search',
          component: (
            <SearchSection
              searchType={searchType}
              searchQuery={searchQuery}
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
              setSearchType={setSearchType}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          ),
        },
      ],
    },
    {
      title: 'Listado de Usuarios',
      data: [
        {
          key: 'users-list',
          component: (
            <UserList users={users} handleDelete={handleDelete} />
          ),
        },
      ],
    },
  ];

  return (
    <PaperProvider>
     <View style={styles.headerContainer}>
  <Text style={styles.title}>Usuarios</Text>
  <Link href="/users/create" asChild>
    <IconButton 
      icon="plus"
      size={20}
      onPress={() => {}}
    />
  </Link>
</View>
      <View style={styles.container}>
        <SectionListWrapper sections={sections} />
      </View>
    </PaperProvider>
  );
}