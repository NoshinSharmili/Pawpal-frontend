import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FosterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    experience: '',
    preferredPets: [],
    maxPets: '',
    availability: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequirements: '',
  });

  const petTypes = ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Small Animals'];
  const availabilityOptions = ['Full Time', 'Part Time', 'Weekends Only', 'Emergency Only'];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load saved profile data from AsyncStorage
      const savedProfile = await AsyncStorage.getItem('fosterProfileData');
      const availabilityStatus = await AsyncStorage.getItem('fosterAvailability');
      
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      
      if (availabilityStatus) {
        setIsAvailable(availabilityStatus === 'true');
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePetTypeToggle = (petType: string) => {
    setProfileData(prev => ({
      ...prev,
      preferredPets: prev.preferredPets.includes(petType)
        ? prev.preferredPets.filter(type => type !== petType)
        : [...prev.preferredPets, petType]
    }));
  };

  const handleAvailabilityToggle = async (value: boolean) => {
    setIsAvailable(value);
    try {
      await AsyncStorage.setItem('fosterAvailability', value.toString());
      // Also update on server if needed
      // await updateAvailabilityOnServer(value);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('fosterProfileData', JSON.stringify(profileData));
      
      // Update on server
      const response = await fetch('http://localhost:5000/api/foster/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setIsEditing(false);
        Alert.alert('Success', 'Your profile has been updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfileData(); // Reload original data
  };

  const renderField = (label: string, value: string, field: string, isTextArea = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.fieldInput, isTextArea && styles.textArea]}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 3 : 1}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      )}
    </View>
  );

  const renderPetPreferences = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Preferred Pet Types</Text>
      {isEditing ? (
        <View style={styles.petTypeGrid}>
          {petTypes.map((petType) => (
            <TouchableOpacity
              key={petType}
              style={[
                styles.petTypeButton,
                profileData.preferredPets.includes(petType) && styles.petTypeButtonSelected
              ]}
              onPress={() => handlePetTypeToggle(petType)}
            >
              <Text style={[
                styles.petTypeText,
                profileData.preferredPets.includes(petType) && styles.petTypeTextSelected
              ]}>
                {petType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>
          {profileData.preferredPets.length > 0 ? profileData.preferredPets.join(', ') : 'Not specified'}
        </Text>
      )}
    </View>
  );

  const renderAvailabilityField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Foster Availability</Text>
      {isEditing ? (
        <View style={styles.optionColumn}>
          {availabilityOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              onPress={() => handleInputChange('availability', option)}
            >
              <View style={[styles.radio, profileData.availability === option && styles.radioSelected]}>
                {profileData.availability === option && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>{profileData.availability || 'Not specified'}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Foster Profile</Text>
        <TouchableOpacity
          onPress={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Ionicons 
            name={isEditing ? "close" : "pencil"} 
            size={20} 
            color="#f1787e" 
          />
        </TouchableOpacity>
      </View>

      {/* Availability Status Card */}
      <View style={[styles.statusCard, isAvailable ? styles.availableCard : styles.unavailableCard]}>
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <MaterialCommunityIcons 
              name={isAvailable ? "heart-circle" : "heart-off"} 
              size={32} 
              color={isAvailable ? "#4CAF50" : "#ff6b6b"} 
            />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {isAvailable ? 'Available for Fostering' : 'Currently Unavailable'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isAvailable ? 'Ready to help pets in need' : 'Not accepting new foster requests'}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleAvailabilityToggle}
            value={isAvailable}
            style={styles.availabilitySwitch}
          />
        </View>
      </View>

      {/* Foster Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Pets Fostered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active Requests</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5.0</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderField('Full Name', profileData.fullName, 'fullName')}
        {renderField('Email', profileData.email, 'email')}
        {renderField('Phone', profileData.phone, 'phone')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        {renderField('Street Address', profileData.address, 'address')}
        <View style={styles.row}>
          <View style={styles.flex1}>
            {renderField('City', profileData.city, 'city')}
          </View>
          <View style={[styles.flex1, styles.marginLeft]}>
            {renderField('Zip Code', profileData.zipCode, 'zipCode')}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foster Preferences</Text>
        {renderPetPreferences()}
        {renderField('Maximum Pets', profileData.maxPets, 'maxPets')}
        {renderField('Experience', profileData.experience, 'experience', true)}
        {renderAvailabilityField()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        {renderField('Contact Name', profileData.emergencyContact, 'emergencyContact')}
        {renderField('Contact Phone', profileData.emergencyPhone, 'emergencyPhone')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        {renderField('Special Requirements', profileData.specialRequirements, 'specialRequirements', true)}
      </View>

      {/* Action Buttons */}
      {isEditing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelEdit}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
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