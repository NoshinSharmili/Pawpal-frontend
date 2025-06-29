import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({ name: '', email: '', pets: [] });

  // You’ll later replace this with an API call
  useEffect(() => {
    const dummyData = {
      name: 'Arefin',
      email: 'arefin@example.com',
      pets: [
        { id: '1', name: 'Milo', breed: 'Persian Cat' },
        { id: '2', name: 'Rocky', breed: 'Labrador' }
      ]
    };
    setUser(dummyData);
  }, []);

  const renderPet = ({ item }) => (
    <View style={styles.petCard}>
      <Text>{item.name} - {item.breed}</Text>
      <Button title="View" onPress={() => navigation.navigate('PetProfileScreen', { petId: item.id })} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <Text style={styles.sectionTitle}>Your Pets</Text>
      <FlatList
        data={user.pets}
        renderItem={renderPet}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>You don’t have any pets yet.</Text>}
      />

      <Button title="Add New Pet" onPress={() => navigation.navigate('AddPetScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  petCard: { padding: 10, borderWidth: 1, marginBottom: 10 }
});
