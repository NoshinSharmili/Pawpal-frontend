import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../../context/UserContext';
import { API_BASE_URL } from '../../../config/api';

interface Pet {
  id?: string;
  _id?: string;
  name: string;
  breed: string;
  dob: string;
  vaccinationStatus: boolean;
  healthStatus: string;
  notes?: string;
  image?: string; // Add image field
  // Add any other fields you expect from the API
}

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  const { userId } = useUser();
  console.log(petId);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [adoptionLoading, setAdoptionLoading] = useState(false);
  
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
        const response = await fetch(`${API_BASE_URL}/api/pets/${petId}`);
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

  // Determine owner (support both ownerId and userId fields)
  const ownerId = (pet as any).ownerId || (pet as any).userId;
  const isOwner = userId && ownerId && userId === ownerId;
  const adoptionStatus = (pet as any).adoptionStatus || (pet as any).status || 'personal';

  // Handler to toggle adoption status
  const handleToggleAdoptionStatus = async () => {
    if (!pet || !pet._id && !pet.id) return;
    setAdoptionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pets/${pet._id || pet.id}/adoption-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adoptionStatus: adoptionStatus === 'personal' ? 'up for adoption' : 'personal',
        }),
      });
      if (!res.ok) throw new Error('Failed to update adoption status');
      const updated = await res.json();
      setPet(updated);
    } catch (err) {
      alert('Could not update adoption status.');
    } finally {
      setAdoptionLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <View style={{width : 50}}></View>
        <Text style={styles.title}>Pet Profile</Text>
        <View style={{marginLeft : 100}}>
          {isOwner && (
            <TouchableOpacity
              onPress={async () => {
                try {
                  setLoading(true);
                  const response = await fetch(`${API_BASE_URL}/api/pets/${pet._id || pet.id}`, {
                    method: 'DELETE',
                  });
                  if (!response.ok) throw new Error('Failed to delete pet');
                  router.push('/homepage');
                } catch (err) {
                  setLoading(false);
                  alert('Failed to delete pet.');
                }
              }}
              accessibilityLabel="Delete Pet"
              style={{ padding: 8 }}
            >
              <Ionicons name="trash" size={28} color="#d9534f" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    
      {/* Pet Photo */}
      <View style={styles.photoContainer}>
        <Image
          source={pet.image ? { uri: pet.image } : require('@/assets/images/cat.png')}
          style={styles.petPhoto}
          resizeMode="cover"
        />
        <Text style={{alignItems:'center', fontWeight: 'bold', color: '#C74C58', fontSize: 22,  paddingTop: 10}}>{pet.name}</Text>
      </View>

      <View style={styles.card}>

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
        {!isOwner && (
          <>
            {/* Adopt Me Button */}
            <TouchableOpacity
              style={[styles.button, styles.adoptButton]}
              onPress={() => {
                router.push({ pathname: '/adoptionform', params: { petId: petId } });
              }}
            >
              <Text style={styles.buttonText}>Adopt Me</Text>
            </TouchableOpacity>
          </>
        )}
        {isOwner && (
          <>
            {/* Adoption Status Toggle Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: adoptionStatus === 'personal' ? '#C74C58' : '#F44336', marginBottom: 10 }]}
              onPress={handleToggleAdoptionStatus}
              disabled={adoptionLoading}
            >
              <Text style={styles.buttonText}>
                {adoptionLoading
                  ? (adoptionStatus === 'personal' ? 'Putting Up...' : 'Cancelling...')
                  : (adoptionStatus === 'personal' ? 'Put Up For Adoption' : 'Cancel Adoption Request')}
              </Text>
            </TouchableOpacity>
            {/* Foster Care Button */}
            <TouchableOpacity
              style={[styles.button, styles.fosterButton]}
              onPress={() => {
                router.push({ pathname: '/(tabs)/FosterFinderScreen', params: { petId: petId } });
              }}
            >
              <Text style={styles.buttonText}>Request Foster Care</Text>
            </TouchableOpacity>

            {/* Health Tracker Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#1976D2', marginTop: 10 }]}
              onPress={() => {
                router.push({ pathname: '/HealthTrackerScreen', params: { petId: petId } });
              }}
            >
              <Text style={styles.buttonText}>Health Tracker</Text>
            </TouchableOpacity>
            
          </>
        )}
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 40
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f1787e',
  },
});