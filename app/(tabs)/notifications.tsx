import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_BASE_URL } from '../../config/api';


interface AdoptionApplication {
  _id: string;
  petId?: { name?: string };
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export default function NotificationsPage() {
  const { userId } = useUser();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [myApplications, setMyApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'requests' | 'myapps'>('requests');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/adoption-applications/user/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch adoption applications');
          return res.json();
        })
        .catch(() => []),
      fetch(`${API_BASE_URL}/api/adoption-applications/applicant/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch your applications');
          return res.json();
        })
        .catch(() => []),
    ])
      .then(([requests, myapps]) => {
        setApplications(requests);
        setMyApplications(myapps);
        setError(null);
      })
      .catch(() => {
        setApplications([]);
        setMyApplications([]);
        setError('Could not load adoption applications.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const renderRequestItem = ({ item }: { item: AdoptionApplication }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/adoption-application', params: { id: item._id } })}
    >
      <Text style={styles.petName}>{item.petId?.name || 'Pet'}</Text>
      <Text style={styles.status}>Status: {item.status || 'Pending'}</Text>
      <Text style={styles.date}>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : ''}</Text>
    </TouchableOpacity>
  );

  const renderMyAppItem = ({ item }: { item: AdoptionApplication }) => (
    <View style={styles.card}>
      <Text style={styles.applicationText}>
        Your adoption application for{' '}
        <Text style={styles.highlightedPet}>{item.petId?.name || 'Pet'}</Text>
        {' '}is{' '}
        <Text style={styles.highlightedStatus}>{item.status || 'Pending'}</Text>
      </Text>
      <Text style={styles.date}>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : ''}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'requests' && styles.tabSelected]}
          onPress={() => setTab('requests')}
        >
          <Text style={[styles.tabText, tab === 'requests' && styles.tabTextSelected]}>Adoption Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'myapps' && styles.tabSelected]}
          onPress={() => setTab('myapps')}
        >
          <Text style={[styles.tabText, tab === 'myapps' && styles.tabTextSelected]}>Your Applications</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#d16d78" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : tab === 'requests' ? (
        applications.length === 0 ? (
          <Text style={styles.empty}>No adoption requests found.</Text>
        ) : (
          <FlatList
            data={applications}
            keyExtractor={item => item._id}
            renderItem={renderRequestItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )
      ) : (
        myApplications.length === 0 ? (
          <Text style={styles.empty}>No applications submitted.</Text>
        ) : (
          <FlatList
            data={myApplications}
            keyExtractor={item => item._id}
            renderItem={renderMyAppItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
  },
  tabSelected: {
    backgroundColor: '#d16d78',
  },
  tabText: {
    color: '#d16d78',
    fontWeight: '600',
    fontSize: 15,
  },
  tabTextSelected: {
    color: '#fff',
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
  applicationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  highlightedPet: {
    fontWeight: 'bold',
    color: '#d16d78',
  },
  highlightedStatus: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
}); 