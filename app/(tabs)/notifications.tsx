import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

interface AdoptionApplication {
  _id: string;
  petName?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export default function NotificationsPage() {
  const { userId } = useUser();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://10.0.2.2:5000/api/adoption-applications/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch adoption applications');
        return res.json();
      })
      .then(data => {
        setApplications(data);
        setError(null);
      })
      .catch(err => {
        setApplications([]);
        setError('Could not load adoption applications.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const renderItem = ({ item }: { item: AdoptionApplication }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/adoption-application', params: { id: item._id } })}
    >
      <Text style={styles.petName}>{item.petId.name || 'Pet'}</Text>
      <Text style={styles.status}>Status: {item.status || 'Pending'}</Text>
      <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adoption Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#d16d78" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : applications.length === 0 ? (
        <Text style={styles.empty}>No adoption requests found.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d16d78',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  status: {
    fontSize: 15,
    color: '#d16d78',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
}); 