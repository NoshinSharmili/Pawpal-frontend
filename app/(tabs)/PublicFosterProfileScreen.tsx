import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PublicFosterProfileScreen() {
  const { fosterId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<null | {
    fosterName: string;
    email: string;
    phone: string;
    address: string;
    preferredPets: string[];
    capacity: number;
    availabilityStatus: 'available' | 'unavailable';
    details?: string;
    totalPetsFosterd: number;
    currentNumberOfFosterPets: number;
  }>(null);

  useEffect(() => {
    if (fosterId) fetchProfile();
  }, [fosterId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://10.0.2.2:5000/api/fosters/${fosterId}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load foster profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f1787e" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No foster profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/FosterFinderScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>{profile.fosterName}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Availability Status Card */}
      <View style={[styles.statusCard, profile.availabilityStatus === 'available' ? styles.availableCard : styles.unavailableCard]}>
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <MaterialCommunityIcons
              name={profile.availabilityStatus === 'available' ? 'heart-circle' : 'heart-off'}
              size={32}
              color={profile.availabilityStatus === 'available' ? '#4CAF50' : '#ff6b6b'}
            />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {profile.availabilityStatus === 'available' ? 'Available for Fostering' : 'Currently Unavailable'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {profile.availabilityStatus === 'available' ? 'Ready to help pets in need' : 'Not accepting new foster requests'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Foster Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profile.totalPetsFosterd}</Text>
          <Text style={styles.statLabel}>Pets Fostered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profile.currentNumberOfFosterPets}</Text>
          <Text style={styles.statLabel}>Currently Fostering</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profile.capacity}</Text>
          <Text style={styles.statLabel}>Capacity</Text>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <Text style={styles.fieldValue}>{profile.fosterName}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{profile.email}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <Text style={styles.fieldValue}>{profile.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Street Address</Text>
          <Text style={styles.fieldValue}>{profile.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foster Preferences</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Preferred Pet Types</Text>
          <Text style={styles.fieldValue}>{profile.preferredPets && profile.preferredPets.length > 0 ? profile.preferredPets.join(', ') : 'Not specified'}</Text>
        </View>
      </View>

      {profile.details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldValue}>{profile.details}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  availableCard: {
    backgroundColor: '#f0fff4',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  unavailableCard: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1787e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1787e',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 40,
  },
});
