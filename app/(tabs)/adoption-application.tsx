import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

interface AdoptionApplication {
  _id: string;
  userId?: any;
  petId?: any;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export default function AdoptionApplicationDetail() {
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState<AdoptionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/adoption-applications/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch application');
        return res.json();
      })
      .then(data => {
        setApplication(data);
        setError(null);
      })
      .catch(err => {
        setApplication(null);
        setError('Could not load application.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#d16d78" style={{ marginTop: 40 }} />;
  }
  if (error || !application) {
    return <Text style={styles.error}>{error || 'Application not found.'}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adoption Application</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Pet Name:</Text>
        <Text style={styles.value}>{application.petId?.name || 'N/A'}</Text>

        <Text style={styles.label}>Applicant Name:</Text>
        <Text style={styles.value}>{application.userId?.name || application.userId?.email || 'N/A'}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{application.status || 'Pending'}</Text>

        <Text style={styles.label}>Submitted:</Text>
        <Text style={styles.value}>{application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}</Text>

        {/* Render all other fields dynamically */}
        {Object.entries(application).map(([key, value]) => {
          if ([
            '_id', 'userId', 'petId', 'status', 'createdAt', 'updatedAt', '__v'
          ].includes(key)) return null;
          return (
            <View key={key} style={{ marginBottom: 8 }}>
              <Text style={styles.label}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
              <Text style={styles.value}>{typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}</Text>
            </View>
          );
        })}
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
}); 