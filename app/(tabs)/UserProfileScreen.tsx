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
        const userRes = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);
        // Fetch pets
        const petsRes = await fetch(`http://localhost:5000/api/pets/user/${userId}`);
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
    <View key={pet._id || pet.id} style={styles.petCard}>
      <Text style={styles.petName}>{pet.name} - {pet.breed}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => router.push({ pathname: '/PetProfileScreen/[petId]', params: { petId: pet._id || pet.id } })}>
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
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.sectionTitle}>Your Pets</Text>
      {pets.length > 0 ? pets.map(renderPet) : <Text>No pets found.</Text>}
      <TouchableOpacity style={styles.addButton} onPress={() => router.replace('/createpet')}>
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