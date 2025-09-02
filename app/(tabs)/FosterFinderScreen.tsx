import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Foster {
  _id: string;
  user: string;
  fosterName: string;
  details?: string;
  address: string;
  preferredPets: string[];
}

export default function FosterFinderScreen() {
  const [fosters, setFosters] = useState<Foster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFosters();
  }, []);

  const fetchFosters = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:5000/api/fosters');
      if (!res.ok) throw new Error('Failed to fetch fosters');
      const data = await res.json();
      setFosters(data);
    } catch (err) {
      setFosters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (fosterId: string) => {
    router.push({ pathname: '/(tabs)/PublicFosterProfileScreen', params: { fosterId } });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f1787e" />
      </View>
    );
  }

  if (!fosters.length) {
    return (
      <View style={styles.centered}>
        <Text>No fosters found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Foster</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {fosters.map(foster => (
        <TouchableOpacity
          key={foster._id}
          style={styles.card}
          onPress={() => handleCardPress(foster._id)}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="home-heart" size={28} color="#f1787e" style={{ marginRight: 12 }} />
            <Text style={styles.fosterName}>{foster.fosterName}</Text>
          </View>
          {foster.details ? (
            <Text style={styles.details}>{foster.details}</Text>
          ) : null}
          <Text style={styles.address}><Ionicons name="location-outline" size={16} color="#888" /> {foster.address}</Text>
          <Text style={styles.petTypes}>
            Preferred Pets: {foster.preferredPets && foster.preferredPets.length > 0 ? foster.preferredPets.join(', ') : 'Any'}
          </Text>
        </TouchableOpacity>
      ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#faf9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fosterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  petTypes: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
