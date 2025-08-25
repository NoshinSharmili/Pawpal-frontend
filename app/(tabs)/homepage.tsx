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
import { useUser } from '../../context/UserContext';

const categories = [
  { id: 'all', label: 'All', icon: require('@/assets/images/all.png') },
  { id: 'cats', label: 'Cats', icon: require('@/assets/images/catto1.png') },
  { id: 'dogs', label: 'Dogs', icon: require('@/assets/images/dog.png') },
  { id: 'rabbits', label: 'Rabbits', icon: require('@/assets/images/rabit.png') },
  { id: 'birds', label: 'Birds', icon: require('@/assets/images/bird.png') },
  { id: 'others', label: 'Others', icon: require('@/assets/images/other.png') },
];

const placeholderImage = require('@/assets/images/cat.png'); // Use any placeholder image you have

interface Pet {
  _id: string;
  id?: string;
  name?: string;
  breed?: string;
  gender?: string;
  color?: string;
  location?: string;
  age?: number;
  dob?: string;
  image?: string; // Added image property
  type?: string; // Added type property
  [key: string]: any; // For any additional properties
}

export default function HomePage() {
  const { userId } = useUser();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasFosterProfile, setHasFosterProfile] = useState(false);
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
        const response = await fetch('http://10.0.2.2:5000/api/pets/');
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        // Only include pets with adoptionStatus === 'up for adoption'
        const upForAdoption = data.filter((pet: any) => (pet.adoptionStatus || pet.status) === 'up for adoption');
        setPets(upForAdoption);
        setFilteredPets(upForAdoption); // Initialize filtered pets with all pets
      } catch (err) {
        setPets([]);
        setFilteredPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
    // console.log(pets); // Don't log pets here, as it's async
  }, []);

  useEffect(() => {
    const fetchFosterProfile = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://10.0.2.2:5000/api/fosters/user/${userId}`);
        setHasFosterProfile(res.ok);
      } catch {
        setHasFosterProfile(false);
      }
    };
    fetchFosterProfile();
  }, [userId]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter((pet: Pet) => {
        const query = searchQuery.toLowerCase();
        return (
          pet.name?.toLowerCase().includes(query) ||
          pet.breed?.toLowerCase().includes(query) ||
          pet.gender?.toLowerCase().includes(query) ||
          pet.color?.toLowerCase().includes(query) ||
          pet.location?.toLowerCase().includes(query)
        );
      });
      setFilteredPets(filtered);
    }
  }, [searchQuery, pets]);

  // Category filter
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPets(pets);
    } else {
      setFilteredPets(pets.filter((pet: Pet) => pet.type === selectedCategory));
    }
  }, [selectedCategory, pets]);

  const handleSearch = () => {
    // This function can be used for additional search actions if needed
    // The search is already handled by the useEffect above
    console.log('Searching for:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPets(pets);
  };
  
  const handleDropdownOption = (option: string) => {
    setShowDropdown(false);
    switch (option) {
      case 'profile':
        router.push('/UserProfileScreen');
        break;
      case 'foster':
        if (hasFosterProfile) {
          router.push('/FosterProfile');
        } else {
          router.push('/RegisterFoster');
        }
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      default:
        break;
    }
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => { router.push({ pathname: '/PetProfileScreen/[petId]', params: { petId: item._id } });}}>
      <Image source={item.image ? { uri: item.image } : placeholderImage} style={styles.petImage} />
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
        {/* <Ionicons name="menu" size={28} color="#333" /> */}
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"

        />
      <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            style={styles.profileButton}
          >
            <Ionicons name="person-circle" size={30} color="#f1787e" />
          </TouchableOpacity>
         
          {showDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownOption('profile')}
              >
                <Ionicons name="person-outline" size={20} color="#f1787e" />
                <Text style={styles.dropdownText}>Your Profile</Text>
              </TouchableOpacity>
             
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownOption('foster')}
              >
                <MaterialCommunityIcons name="heart-plus" size={20} color="#f1787e" />
                <Text style={styles.dropdownText}>{hasFosterProfile ? 'Your Foster Profile' : 'Register as Foster'}</Text>
              </TouchableOpacity>
             
              <TouchableOpacity
                style={[styles.dropdownItem, styles.lastDropdownItem]}
                onPress={() => handleDropdownOption('notifications')}
              >
                <Ionicons name="notifications-outline" size={20} color="#f1787e" />
                <Text style={styles.dropdownText}>Notifications</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </View>
      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for pets by name, breed, color..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#d16d78" />
        </TouchableOpacity>
      </View>

      {/* Vet Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <MaterialCommunityIcons name="stethoscope" size={28} color="#fff" style={styles.bannerIcon} />
          <Text style={styles.bannerText}>Is your pet{"\n"}okay?</Text>
        </View>
        <TouchableOpacity 
          style={styles.seekHelpButton}
          onPress={() => {
            router.push('/VetFinderScreen');
          }}
        >
          <Text style={styles.seekHelpButtonText}>Seek Help</Text>
        </TouchableOpacity>
      </View>

      {/* Foster Finder Banner */}
      <View style={[styles.banner, {backgroundColor: '#f89a9f'}]}>
        <View style={styles.bannerContent}>
          <MaterialCommunityIcons name="home-circle-outline" size={28} color="#fff" style={styles.bannerIcon} />
          <Text style={styles.bannerText}>Looking for a {"\n"}foster home?</Text>
        </View>
        <TouchableOpacity
          style={styles.seekHelpButton}
          onPress={() => {
            router.push('/FosterFinderScreen');
          }}
        >
          <Text style={styles.seekHelpButtonText}>See Fosters</Text>
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
          <TouchableOpacity
            key={item.id}
            style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategoryItem]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Image source={item.icon} style={styles.categoryIcon} /> 
            <Text style={[styles.categoryLabel, selectedCategory === item.id && styles.selectedCategoryLabel]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pet Cards */}
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading pets...</Text>
      ) : filteredPets.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <MaterialCommunityIcons name="magnify" size={48} color="#ccc" />
          <Text style={styles.noResultsText}>
            {searchQuery ? `No pets found for "${searchQuery}"` : 'No pets available'}
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          {searchQuery && (
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsText}>
                Found {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearSearchText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={filteredPets}
            keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.petRow}
            renderItem={renderPetCard}
          />
        </>
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
    height: 30,
    minHeight: 40,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    zIndex: -1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingRight: 8,
  },
  clearButton: {
    marginRight: 8,
  },
  searchButton: {
    padding: 4,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#d16d78',
    fontWeight: '600',
  },
  clearSearchButton: {
    backgroundColor: '#d16d78',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  banner: {
    backgroundColor: '#f1787e', // Changed back to the original pink color
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: -1,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seekHelpButton: {
    width: '40%',
    height: '90%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  seekHelpButtonText: {
    color: '#f1787e', // Changed to match the pink banner color
    fontWeight: '600',
    fontSize: 14,
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
    borderRadius: 10,
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
  profileContainer: {
    position: 'relative',
    zIndex: 1001,
  },
  profileButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    zIndex: 9999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  selectedCategoryItem: {
    backgroundColor: '#ffe6ea',
    borderRadius: 16,
    padding: 4,
  },
  selectedCategoryLabel: {
    color: '#d16d78',
    fontWeight: 'bold',
  },
});
