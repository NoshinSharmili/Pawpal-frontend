<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function PetProfileScreen() {
  // Dummy data for the pet
  const [pet] = useState({
    name: 'Milo',
    breed: 'Persian Cat',
    age: 3,
    vaccinationStatus: 'Up to Date',
    healthCondition: 'Healthy',
    notes: 'Very playful, loves to sleep in the sun.',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pet Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{pet.name}</Text>

        <Text style={styles.label}>Breed:</Text>
        <Text style={styles.value}>{pet.breed}</Text>

        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{pet.age} years</Text>

        <Text style={styles.label}>Vaccination Status:</Text>
        <Text style={styles.value}>{pet.vaccinationStatus}</Text>

        <Text style={styles.label}>Health Condition:</Text>
        <Text style={styles.value}>{pet.healthCondition}</Text>

        <Text style={styles.label}>Care Notes:</Text>
        <Text style={styles.value}>{pet.notes}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Pet Info</Text>
      </TouchableOpacity>
    </ScrollView>
=======
>>>>>>> Stashed changes
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  vaccinationStatus: string;
  healthCondition: string;
}

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const dummyPet: Pet = {
      id: String(petId),
      name: 'Milo',
      breed: 'Persian Cat',
      age: 3,
      vaccinationStatus: 'Up-to-date',
      healthCondition: 'Healthy',
    };
    setPet(dummyPet);
  }, [petId]);

  if (!pet) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.detail}>Breed: {pet.breed}</Text>
      <Text style={styles.detail}>Age: {pet.age}</Text>
      <Text style={styles.detail}>Vaccination: {pet.vaccinationStatus}</Text>
      <Text style={styles.detail}>Health: {pet.healthCondition}</Text>
    </View>
<<<<<<< Updated upstream
=======
>>>>>>> f4b6ecfee2501e090e7e81a2a3f726614b9eb3c2
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
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
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFE9EC',
    marginBottom: 24,
    padding: 22,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#C74C58',
    marginTop: 10,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#232323',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#C74C58',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
=======
>>>>>>> Stashed changes
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
});

<<<<<<< Updated upstream
=======
>>>>>>> f4b6ecfee2501e090e7e81a2a3f726614b9eb3c2
>>>>>>> Stashed changes
