import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { WebView } from 'react-native-webview';
import { API_BASE_URL } from '../../config/api';

// Type definitions
interface VetLocation {
  coordinates: number[];
}

// interface VetAddress {
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
// }

interface Vet {
  _id: string;
  name: string;
  address: string;
  services: string[];
  rating: number;
  reviewCount: number;
  phone: string;
  latitude: number;
  longitude: number;
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

// Utility function to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

//VetListView Component with proper typing
const VetListView: React.FC<VetListViewProps> = ({ vets, userLocation, navigation }) => {
  const renderVetItem = ({ item }: { item: Vet }) => {
    // Calculate distance if userLocation and vet location are available
    let distanceText = '';
    if (userLocation) {
      // Note: coordinates are [longitude, latitude]
      const vetLat = item.latitude;
      const vetLon = item.longitude;
      console.log(vetLat, vetLon, userLocation.latitude, userLocation.longitude);
      const dist = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, vetLat, vetLon);
      distanceText = `${dist.toFixed(1)} km away`;
    }
    return (
      <TouchableOpacity 
        style={styles.vetCard}
        onPress={() => console.log('Vet selected:', item.name)}
      >
        <View style={styles.vetInfo}>
          <Text style={styles.vetName}>{item.name}</Text>
          <Text style={styles.vetAddress}>{item.address}</Text>
          
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
            <Text style={styles.distance}>{distanceText}</Text>
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
  if (!userLocation) {
    return (
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.mapSubtext}>Map View</Text>
        <Text style={styles.mapNote}>User location not available</Text>
      </View>
    );
  }

  // Prepare markers for vets and user
  const allMarkers = [
    // User marker (special color)
    {
      lat: userLocation.latitude,
      lng: userLocation.longitude,
      label: 'You',
      color: 'blue',
    },
    // Vet markers
    ...vets.filter(vet => vet.latitude && vet.longitude).map(vet => ({
      lat: vet.latitude,
      lng: vet.longitude,
      label: vet.name,
      color: 'red',
    }))
  ];

  // HTML for Leaflet map
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
      <style> #map { height: 100vh; width: 100vw; } html, body { margin: 0; padding: 0; height: 100%; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
        var markers = ${JSON.stringify(allMarkers)};
        markers.forEach(function(m) {
          L.marker([m.lat, m.lng], {icon: L.icon({iconUrl: m.color === 'blue' ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png' : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: 'https://unpkg.com/leaflet@1.8.0/dist/images/marker-shadow.png', shadowSize: [41, 41]})})
            .addTo(map)
            .bindPopup(m.label);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, margin: 15, borderRadius: 10, overflow: 'hidden' }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: leafletHTML }}
        style={{ flex: 1, borderRadius: 10 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
      />
    </View>
  );
};

//Main VetFinderScreen Component with proper typing
const VetFinderScreen: React.FC<VetFinderScreenProps> = ({ navigation }) => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    setLoading(true);
    // Simulate user location (replace with real geolocation if available)
    setUserLocation({ latitude: 23.7805, longitude: 90.4125 });
    // Fetch vets from API
    fetch(`${API_BASE_URL}/api/vets`)
      .then((response) => response.json())
      .then((data) => {
        // Map API data to Vet[]
        const mappedVets: Vet[] = data.map((vet: any) => ({
          _id: vet._id,
          name: vet.clinicName || vet.name,
          address:  vet.address || 'No address provided' ,
          services: vet.services || [],
          rating: vet.rating || 4.0, // fallback if not present
          reviewCount: vet.reviews ? vet.reviews.length : 0,
          phone: vet.phone,
          latitude: vet.latitude,
          longitude: vet.longitude,
          location: {
            coordinates: vet.location?.coordinates || [0, 0],
          },
        }));
        setVets(mappedVets);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch vets');
      });
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
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text testID="vet-finder-title" style={styles.title}>Find Veterinarians</Text>
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