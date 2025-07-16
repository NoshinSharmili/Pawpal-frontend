import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { id: '1', label: 'Cat', icon: require('@/assets/images/catto1.png') },
  { id: '2', label: 'Dog', icon: require('@/assets/images/dog.png') },
  { id: '3', label: 'Rabbit', icon: require('@/assets/images/rabit.png') },
];

const placeholderImage = require('@/assets/images/cat.png'); // Use any placeholder image you have

export default function HomePage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const dobTruncate = (dob: string | undefined) => {
    return dob?.split('T')[0] || 'Unknown DOB';
  }
  const ageFromDob = (dob: string | undefined) => {
    if (!dob) return 'Unknown Age';
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    return age;
  }

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/pets/');
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        setPets(data);
      } catch (err) {
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
    console.log(pets);
  }, []);

  const renderPetCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => { router.push({ pathname: '/PetProfileScreen/[petId]', params: { petId: item._id } });}}>
      <Image source={placeholderImage} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>{item.breed || ''}{item.gender ? `, ${item.gender}` : ''}{item.age ? `, ${item.age}` : ''}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="calendar-outline" size={12} color="#888" />
          <Text style={styles.locationText}>{ageFromDob(item.dob)} years</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.heartIcon}>
        <MaterialCommunityIcons name="heart-outline" size={20} color="#d16d78" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="#333" />
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ width: 28 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for pets"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color="#d16d78" />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Pet Adoption{"\n"}Made Easy</Text>
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Adopt now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Show All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <View key={item.id} style={styles.categoryItem}>
            <Image source={item.icon} style={styles.categoryIcon} />
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Pet Cards */}
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading pets...</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.petRow}
          renderItem={renderPetCard}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  banner: {
    backgroundColor: '#f1787e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adoptButton: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  adoptButtonText: {
    color: '#f1787e',
    fontWeight: '600',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  sectionLink: {
    fontSize: 13,
    color: '#d16d78',
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#333',
  },
  petRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  petCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 10,
    width: '48%',
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  petInfo: {
    marginBottom: 10,
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  petDetails: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 4,
  },
});
