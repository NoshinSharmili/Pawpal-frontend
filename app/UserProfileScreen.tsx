import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface Pet {
  id: string;
  name: string;
  breed: string;
}

interface User {
  name: string;
  email: string;
  pets: Pet[];
}

export default function UserProfileScreen() {
  const [user, setUser] = useState<User>({ name: '', email: '', pets: [] });

  useEffect(() => {
    const dummyData: User = {
      name: 'Arefin',
      email: 'arefin@example.com',
      pets: [
        { id: '1', name: 'Milo', breed: 'Persian Cat' },
        { id: '2', name: 'Rocky', breed: 'Labrador' },
      ],
    };
    setUser(dummyData);
  }, []);

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => router.push(`/pet-profile/${item.id}`)}
    >
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.petBreed}>{item.breed}</Text>
    </TouchableOpacity>
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
        ListEmptyComponent={<Text style={styles.emptyText}>You don’t have any pets yet.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-pet')}
      >
        <Text style={styles.addButtonText}>Add New Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#C74C58', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  petCard: {
    borderWidth: 1,
    borderColor: '#C74C58',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  petName: { fontSize: 18, fontWeight: 'bold' },
  petBreed: { fontSize: 14, color: '#555' },
  emptyText: { fontStyle: 'italic', color: '#999' },
  addButton: {
    backgroundColor: '#C74C58',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

