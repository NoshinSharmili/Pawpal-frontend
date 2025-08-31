import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

interface Foster {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  preferredPets: string[];
  maxPets: string;
  experience: string;
  availability: string;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  joinDate: string;
}

interface Pet {
  _id: string;
  name: string;
  breed: string;
  type: string;
}

export default function FosterAvailability() {
  const { petId } = useLocalSearchParams();
  const [fosters, setFosters] = useState<Foster[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingFoster, setRequestingFoster] = useState<string | null>(null);

  useEffect(() => {
    fetchPetDetails();
    fetchAvailableFosters();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`);
      if (response.ok) {
        const petData = await response.json();
        setPet(petData);
      }
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  };

  const fetchAvailableFosters = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from your backend
      const response = await fetch('http://localhost:5000/api/foster/available');
      if (response.ok) {
        const fostersData = await response.json();
        setFosters(fostersData);
      } else {
        // For demo purposes, using dummy data
        setFosters(dummyFosters);
      }
    } catch (error) {
      console.error('Error fetching fosters:', error);
      // Using dummy data as fallback
      setFosters(dummyFosters);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFoster = async (fosterId: string, fosterName: string) => {
    if (!pet) return;

    Alert.alert(
      'Request Foster Care',
      `Send a foster care request to ${fosterName} for ${pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            setRequestingFoster(fosterId);
            try {
              const response = await fetch('http://localhost:5000/api/foster/request', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  petId: pet._id,
                  fosterId: fosterId,
                  petName: pet.name,
                  petBreed: pet.breed,
                  requestDate: new Date().toISOString(),
                }),
              });

              if (response.ok) {
                Alert.alert(
                  'Request Sent!',
                  `Your foster care request for ${pet.name} has been sent to ${fosterName}. They will be notified and can respond through their foster profile.`,
                  [
                    {
                      text: 'OK',
                      onPress: () => router.back()
                    }
                  ]
                );
              } else {
                throw new Error('Failed to send request');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to send foster request. Please try again.');
            } finally {
              setRequestingFoster(null);
            }
          }
        }
      ]
    );
  };

  const renderFosterCard = ({ item }: { item: Foster }) => {
    const isRequesting = requestingFoster === item._id;
    const memberSince = new Date(item.joinDate).getFullYear();
    
    return (
      <View style={styles.fosterCard}>
        {/* Header */}
        <View style={styles.fosterHeader}>
          <View style={styles.fosterInfo}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-heart" size={32} color="#f1787e" />
            </View>
            <View style={styles.fosterDetails}>
              <Text style={styles.fosterName}>{item.fullName}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.location}>{item.city}</Text>
              </View>
              <Text style={styles.memberSince}>Foster since {memberSince}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, item.isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
              <Text style={[styles.statusText, item.isAvailable ? styles.availableText : styles.unavailableText]}>
                {item.isAvailable ? 'Available' : 'Busy'}
              </Text>
            </View>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesContainer}>
          <Text style={styles.preferencesTitle}>Preferred Pets:</Text>
          <View style={styles.petTypeContainer}>
            {item.preferredPets.map((petType, index) => (
              <View key={index} style={styles.petTypeTag}>
                <Text style={styles.petTypeText}>{petType}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Max {item.maxPets} pets</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.availability}</Text>
          </View>
        </View>

        {/* Experience */}
        {item.experience && (
          <View style={styles.experienceContainer}>
            <Text style={styles.experienceTitle}>Experience:</Text>
            <Text style={styles.experienceText} numberOfLines={2}>
              {item.experience}
            </Text>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.requestButton,
            !item.isAvailable && styles.requestButtonDisabled,
            isRequesting && styles.requestButtonLoading
          ]}
          onPress={() => handleRequestFoster(item._id, item.fullName)}
          disabled={!item.isAvailable || isRequesting}
        >
          {isRequesting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.requestButtonText}>Sending...</Text>
            </View>
          ) : (
            <Text style={styles.requestButtonText}>
              {item.isAvailable ? 'Send Foster Request' : 'Currently Unavailable'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#f1787e" />
        <Text style={styles.loadingText}>Finding available fosters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Find Foster Care</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Pet Info Banner */}
      {pet && (
        <View style={styles.petBanner}>
          <MaterialCommunityIcons name="paw" size={24} color="#f1787e" />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>Looking for foster care for {pet.name}</Text>
            <Text style={styles.petDetails}>{pet.breed}</Text>
          </View>
        </View>
      )}

      {/* Fosters List */}
      {fosters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Foster Caregivers Available</Text>
          <Text style={styles.emptyText}>
            There are currently no foster caregivers available in your area. Please try again later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={fosters}
          keyExtractor={(item) => item._id}
          renderItem={renderFosterCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// Dummy data for demonstration
const dummyFosters: Foster[] = [
  {
    _id: '1',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1234567890',
    city: 'Dhaka',
    preferredPets: ['Dogs', 'Cats'],
    maxPets: '2',
    experience: 'I have been fostering pets for over 3 years and have experience with rescue animals.',
    availability: 'Full Time',
    isAvailable: true,
    rating: 4.8,
    reviewCount: 24,
    joinDate: '2022-03-15',
  },
  {
    _id: '2',
    fullName: 'Ahmed Rahman',
    email: 'ahmed.r@email.com',
    phone: '+1234567891',
    city: 'Chittagong',
    preferredPets: ['Cats', 'Small Animals'],
    maxPets: '1',
    experience: 'Experienced with senior pets and those with special medical needs.',
    availability: 'Part Time',
    isAvailable: true,
    rating: 4.9,
    reviewCount: 31,
    joinDate: '2021-08-22',
  },
  {
    _id: '3',
    fullName: 'Maria Garcia',
    email: 'maria.g@email.com',
    phone: '+1234567892',
    city: 'Sylhet',
    preferredPets: ['Dogs', 'Rabbits'],
    maxPets: '3',
    experience: 'Love working with energetic pets and have a large backyard.',
    availability: 'Weekends Only',
    isAvailable: false,
    rating: 4.6,
    reviewCount: 18,
    joinDate: '2023-01-10',
  },
];

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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  petBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  petInfo: {
    marginLeft: 12,
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  fosterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fosterInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fosterDetails: {
    flex: 1,
  },
  fosterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  unavailableBadge: {
    backgroundColor: '#ffeaea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#f44336',
  },
  ratingContainer: {
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  preferencesContainer: {
    marginBottom: 12,
  },
  preferencesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  petTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  petTypeTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1787e',
  },
  petTypeText: {
    fontSize: 12,
    color: '#f1787e',
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  experienceContainer: {
    marginBottom: 16,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  requestButton: {
    backgroundColor: '#f1787e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#ccc',
  },
  requestButtonLoading: {
    backgroundColor: '#f1787e',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});