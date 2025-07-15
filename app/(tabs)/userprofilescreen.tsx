import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Pet {
  id: string;
  name: string;
  breed: string;
}

export default function UserProfileScreen() {
  const [user] = useState({
    name: 'Arefin',
    email: 'arefin@example.com',
    pets: [
      { id: '1', name: 'Milo', breed: 'Persian Cat' },
      { id: '2', name: 'Rocky', breed: 'Labrador' },
    ],
  });

  const renderPet = (pet: Pet) => (
    <View key={pet.id} style={styles.petCard}>
      <Text style={styles.petName}>{pet.name} - {pet.breed}</Text>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.sectionTitle}>Your Pets</Text>
      {user.pets.map(renderPet)}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232323',
    alignSelf: 'flex-start',
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  petCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFE9EC',
    marginBottom: 14,
    padding: 18,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    color: '#232323',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  viewButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#C74C58',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  addButton: {
    marginTop: 26,
    backgroundColor: '#C74C58',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
