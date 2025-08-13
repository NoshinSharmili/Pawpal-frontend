import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Pet {
  id: string;
  name: string;
  breed: string;
  dob: string;
  vaccinationStatus: boolean;
  healthStatus: string;
  notes?: string;
  // Add any other fields you expect from the API
}

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  console.log(petId);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  
  const dobTruncate = (dob: string | undefined) => {
    return dob?.split('T')[0] || 'Unknown DOB';
  }
  
  const ageFromDob = (dob: string | undefined) => {
    if (!dob) return 'Unknown Age';
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    return age;
  }

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
        <Text style={styles.value}>{ageFromDob(pet.dob)} years</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{dobTruncate(pet.dob)}</Text>

        <Text style={styles.label}>Vaccination Status:</Text>
        <Text style={styles.value}>{pet.vaccinationStatus ? 'Yes' : 'No'}</Text>

        <Text style={styles.label}>Health Condition:</Text>
        <Text style={styles.value}>{pet.healthStatus}</Text>

        {pet.notes && (
          <>
            <Text style={styles.label}>Care Notes:</Text>
            <Text style={styles.value}>{pet.notes}</Text>
          </>
        )}
      </View>

      {/* Action Buttons Container */}
      <View style={styles.buttonContainer}>
        {/* Adopt Me Button */}
        <TouchableOpacity 
          style={[styles.button, styles.adoptButton]} 
          onPress={() => { 
            router.push({ pathname: '/adoptionform', params: { petId: petId } }); 
          }}
        >
          <Text style={styles.buttonText}>Adopt Me</Text>
        </TouchableOpacity>

        {/* Foster Care Button */}
        <TouchableOpacity 
          style={[styles.button, styles.fosterButton]} 
          onPress={() => { 
            router.push({ pathname: '/fostercareform', params: { petId: petId } }); 
          }}
        >
          <Text style={styles.buttonText}>Request Foster Care</Text>
        </TouchableOpacity>
      </View>

      {/* Register as Foster Section */}
      <View style={styles.fosterSection}>
        <Text style={styles.fosterSectionTitle}>Want to help pets in need?</Text>
        <TouchableOpacity 
          style={[styles.button, styles.registerFosterButton]} 
          onPress={() => { 
            router.push('/registerfoster'); 
          }}
        >
          <Text style={[styles.buttonText, styles.registerFosterText]}>Register as a Foster</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  adoptButton: {
    backgroundColor: '#C74C58',
  },
  fosterButton: {
    backgroundColor: '#4CAF50', // Green color for foster care
  },
  registerFosterButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C74C58',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  registerFosterText: {
    color: '#C74C58',
  },
  fosterSection: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fosterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});