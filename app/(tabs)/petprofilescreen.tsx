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
  );
}

const styles = StyleSheet.create({
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

