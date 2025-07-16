import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  vaccinationStatus: string;
  healthCondition: string;
  notes?: string;
  // Add any other fields you expect from the API
}

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  console.log(petId);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${petId}`);
        if (!response.ok) throw new Error('Failed to fetch pet');
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setPet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  if (loading) return <Text>Loading...</Text>;
  if (!pet) return <Text>Pet not found.</Text>;

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

        {pet.notes && (
          <>
            <Text style={styles.label}>Care Notes:</Text>
            <Text style={styles.value}>{pet.notes}</Text>
          </>
        )}
      </View>

      
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50', marginTop: 10 }]} onPress={() => router.push({ pathname: '/adoptionform', params: { petId: pet.id } })}>
        <Text style={styles.buttonText}>Adopt Me</Text>
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