import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Type definitions
interface VetLocation {
  coordinates: number[];
}

interface VetAddress {
  fullAddress: string;
}

interface Vet {
  _id: string;
  name: string;
  address: VetAddress;
  services: string[];
  rating: number;
  reviewCount: number;
  phone: string;
  location: VetLocation;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface VetListViewProps {
  vets: Vet[];
  userLocation: UserLocation | null;
  navigation: any;
}

interface VetMapViewProps {
  vets: Vet[];
  userLocation: UserLocation | null;
  navigation: any;
}

interface VetFinderScreenProps {
  navigation: any;
}

// Styles - declared first
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#d16d78',
  },
  toggleText: {
    color: '#666',
  },
  activeToggleText: {
    color: 'white',
  },
  filterButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#d16d78',
    borderRadius: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // List View Styles
  listContainer: {
    padding: 15,
  },
  vetCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vetAddress: {
    color: '#666',
    marginBottom: 10,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  serviceTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 12,
    color: '#d16d78',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginRight: 10,
  },
  reviewCount: {
    color: '#666',
    marginRight: 10,
  },
  distance: {
    color: '#d16d78',
    fontWeight: 'bold',
  },
  // Map View Styles
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    margin: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d16d78',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 48,
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d16d78',
    marginBottom: 5,
  },
  mapNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

// Dummy data with proper typing
const dummyVets: Vet[] = [
  {
    _id: '1',
    name: "Dhaka Veterinary Hospital",
    address: {
      fullAddress: "123 Gulshan Avenue, Gulshan, Dhaka 1212"
    },
    services: ["General Care", "Surgery", "Emergency"],
    rating: 4.5,
    reviewCount: 128,
    phone: "+8801XXXXXXXXX",
    location: {
      coordinates: [90.4125, 23.7805]
    }
  },
  {
    _id: '2',
    name: "Pet Care Center",
    address: {
      fullAddress: "456 Dhanmondi Road, Dhanmondi, Dhaka 1205"
    },
    services: ["Vaccination", "Dental", "Grooming"],
    rating: 4.2,
    reviewCount: 85,
    phone: "+8801YYYYYYYYY",
    location: {
      coordinates: [90.3753, 23.7465]
    }
  },
  {
    _id: '3',
    name: "Animal Health Clinic",
    address: {
      fullAddress: "789 Uttara Sector 3, Uttara, Dhaka 1230"
    },
    services: ["Emergency", "Surgery", "X-Ray"],
    rating: 4.7,
    reviewCount: 156,
    phone: "+8801ZZZZZZZZZ",
    location: {
      coordinates: [90.3964, 23.8748]
    }
  }
];

const dummyUserLocation: UserLocation = {
  latitude: 23.7805,
  longitude: 90.4125
};

//VetListView Component with proper typing
const VetListView: React.FC<VetListViewProps> = ({ vets, userLocation, navigation }) => {
  const renderVetItem = ({ item }: { item: Vet }) => {
    return (
      <TouchableOpacity 
        style={styles.vetCard}
        onPress={() => console.log('Vet selected:', item.name)}
      >
        <View style={styles.vetInfo}>
          <Text style={styles.vetName}>{item.name}</Text>
          <Text style={styles.vetAddress}>{item.address.fullAddress}</Text>
          
          <View style={styles.servicesContainer}>
            {item.services.slice(0, 3).map((service: string, index: number) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
            {item.services.length > 3 && (
              <View style={styles.serviceTag}>
                <Text style={styles.serviceText}>+{item.services.length - 3} more</Text>
              </View>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount} reviews)</Text>
            <Text style={styles.distance}>2.3 km away</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList<Vet>
      data={vets}
      keyExtractor={(item: Vet) => item._id}
      renderItem={renderVetItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No vets found</Text>
        </View>
      )}
    />
  );
};

//VetMapView Component with proper typing
const VetMapView: React.FC<VetMapViewProps> = ({ vets, userLocation, navigation }) => {
  const vetCount: number = vets.length;
  
  return (
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapText}>🗺️</Text>
      <Text style={styles.mapSubtext}>Map View</Text>
      <Text style={styles.mapNote}>Showing {vetCount} vets near you</Text>
      <Text style={styles.mapNote}>Map integration coming soon...</Text>
    </View>
  );
};

//Main VetFinderScreen Component with proper typing
const VetFinderScreen: React.FC<VetFinderScreenProps> = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    // Simulate loading with dummy data
    setLoading(true);
    setTimeout(() => {
      setUserLocation(dummyUserLocation);
      setVets(dummyVets);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d16d78" />
        <Text>Finding nearby vets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Veterinarians</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.activeToggleText]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'map' && styles.activeToggle]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.activeToggleText]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => Alert.alert('Filter', 'Filter functionality coming soon!')}
      >
        <Text style={styles.filterButtonText}>Filter by Services</Text>
      </TouchableOpacity>

      {viewMode === 'list' ? (
        <VetListView 
          vets={vets} 
          userLocation={userLocation}
          navigation={navigation}
        />
      ) : (
        <VetMapView 
          vets={vets} 
          userLocation={userLocation}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default VetFinderScreen;