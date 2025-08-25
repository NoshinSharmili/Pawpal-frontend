import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';


interface Pet {
  id: string;
  name: string;
  breed: string;
}

interface UserData {
  name: string;
  email: string;
}

export default function UserProfileScreen() {
  const { userId } = useUser();
  const [user, setUser] = useState<UserData | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userRes = await fetch(`http://10.0.2.2:5000/api/users/${userId}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);
        // Fetch pets
        const petsRes = await fetch(`http://10.0.2.2:5000/api/pets/user/${userId}`);
        if (!petsRes.ok) throw new Error('Failed to fetch pets');
        const petsData = await petsRes.json();
        setPets(petsData);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch user or pets data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const renderPet = (pet: Pet) => (
    <View key={ pet._id} style={styles.petCard}>
      <Text style={styles.petName}>{pet.name} - {pet.breed}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => router.push({ pathname: '/PetProfileScreen/[petId]', params: { petId:  pet._id } })}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#C74C58" /></View>;
  }
  if (!user) {
    return <View style={styles.container}><Text>User not found.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Profile</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.petCard}>
        
      <Text style={styles.userName}>Name: {user.name}</Text>
      <Text style={styles.userEmail}>Email: {user.email}</Text>
      </View>
      <Text style={styles.sectionTitle}>Your Pets</Text>
      {pets.length > 0 ? pets.map(renderPet) : <Text>No pets found.</Text>}
      <TouchableOpacity style={styles.addButton} onPress={() => router.replace('/createpet')}>
        <Text style={styles.addButtonText}>Add New Pet</Text>
      </TouchableOpacity>
      {/* Register as Foster Section */}
      <View style={styles.fosterSection}>
        <Text style={styles.fosterSectionTitle}>Want to help pets in need?</Text>
        <TouchableOpacity 
          style={[styles.button, styles.registerFosterButton]} 
          onPress={() => { 
            router.push('/RegisterFoster'); 
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
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