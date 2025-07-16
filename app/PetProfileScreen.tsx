import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    // Replace this with API call using petId
    const dummyPet = {
      id: petId,
      name: 'Milo',
      breed: 'Persian Cat',
      age: 3,
      vaccinationStatus: 'Up-to-date',
      healthCondition: 'Healthy'
    };
    setPet(dummyPet);
  }, [petId]);

  if (!pet) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Age: {pet.age}</Text>
      <Text>Vaccination: {pet.vaccinationStatus}</Text>
      <Text>Health: {pet.healthCondition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold' }
});
