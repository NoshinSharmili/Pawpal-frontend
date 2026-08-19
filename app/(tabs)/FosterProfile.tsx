import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_BASE_URL } from '../../config/api';

export default function FosterProfile() {
  const { userId } = useUser();
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
    _id: string; // Added _id for update
  }>(null);
  const [updatingFosterCount, setUpdatingFosterCount] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/fosters/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load foster profile.');
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentFosterCount = async (newCount: number) => {
    if (!profile || updatingFosterCount) return;
    setUpdatingFosterCount(true);
    const prev = profile.currentNumberOfFosterPets;
    setProfile({ ...profile, currentNumberOfFosterPets: newCount });
    try {
      const res = await fetch(`${API_BASE_URL}/api/fosters/${profile._id}/currentNumberOfFosterPets`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentNumberOfFosterPets: newCount })
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      setProfile({ ...profile, currentNumberOfFosterPets: prev });
      Alert.alert('Error', 'Could not update currently fostering count.');
    } finally {
      setUpdatingFosterCount(false);
    }
  };

  const updateAvailabilityStatus = async (newStatus: 'available' | 'unavailable') => {
    if (!profile || updatingAvailability) return;
    setUpdatingAvailability(true);
    const prev = profile.availabilityStatus;
    setProfile({ ...profile, availabilityStatus: newStatus });
    try {
      const res = await fetch(`${API_BASE_URL}/api/fosters/${profile._id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityStatus: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      setProfile({ ...profile, availabilityStatus: prev });
      Alert.alert('Error', 'Could not update availability status.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
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
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Foster Profile</Text>
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
          <Switch
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={profile.availabilityStatus === 'available' ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => updateAvailabilityStatus(profile.availabilityStatus === 'available' ? 'unavailable' : 'available')}
            value={profile.availabilityStatus === 'available'}
            disabled={updatingAvailability}
            style={styles.availabilitySwitch}
          />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => updateCurrentFosterCount(profile.currentNumberOfFosterPets - 1)}
              disabled={profile.currentNumberOfFosterPets <= 0 || updatingFosterCount}
              style={{ marginRight: 8, opacity: profile.currentNumberOfFosterPets <= 0 || updatingFosterCount ? 0.5 : 1 }}
            >
              <Ionicons name="remove-circle-outline" size={24} color="#f1787e" />
            </TouchableOpacity>
            <Text style={styles.statNumber}>{profile.currentNumberOfFosterPets}</Text>
            <TouchableOpacity
              onPress={() => updateCurrentFosterCount(profile.currentNumberOfFosterPets + 1)}
              disabled={updatingFosterCount}
              style={{ marginLeft: 8, opacity: updatingFosterCount ? 0.5 : 1 }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#f1787e" />
            </TouchableOpacity>
          </View>
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
  editButton: {
    padding: 8,
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
  availabilitySwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
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
    fontSize: 18,
    fontWeight: 'bold',
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
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  petTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  petTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  petTypeButtonSelected: {
    backgroundColor: '#f1787e',
    borderColor: '#f1787e',
  },
  petTypeText: {
    color: '#666',
    fontSize: 14,
  },
  petTypeTextSelected: {
    color: '#fff',
  },
  optionColumn: {
    gap: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#f1787e',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f1787e',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#f1787e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 40,
  },
});