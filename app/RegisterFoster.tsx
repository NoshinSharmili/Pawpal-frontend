import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterFoster() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    experience: '',
    preferredPets: [],
    maxPets: '',
    homeType: '',
    hasYard: false,
    hasOtherPets: false,
    otherPetsDetails: '',
    availability: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequirements: '',
  });

  const [loading, setLoading] = useState(false);

  const petTypes = ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Small Animals'];
  const homeTypes = ['House', 'Apartment', 'Condo', 'Townhouse'];
  const availabilityOptions = ['Full Time', 'Part Time', 'Weekends Only', 'Emergency Only'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePetTypeToggle = (petType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredPets: prev.preferredPets.includes(petType)
        ? prev.preferredPets.filter(type => type !== petType)
        : [...prev.preferredPets, petType]
    }));
  };

  const handleBooleanToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'emergencyContact', 'emergencyPhone'];
    
    for (let field of required) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (formData.preferredPets.length === 0) {
      Alert.alert('Error', 'Please select at least one preferred pet type');
      return false;
    }

    if (!formData.homeType) {
      Alert.alert('Error', 'Please select your home type');
      return false;
    }

    if (!formData.availability) {
      Alert.alert('Error', 'Please select your availability');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would send the data to your backend
      const response = await fetch('http://10.0.2.2:5000/api/foster/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert(
          'Success!', 
          'Thank you for registering as a foster! We will review your application and contact you soon.',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Register as Foster</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <MaterialCommunityIcons name="heart-plus" size={48} color="#f1787e" />
        <Text style={styles.welcomeTitle}>Thank you for wanting to help!</Text>
        <Text style={styles.welcomeText}>
          Foster families provide temporary homes for pets in need. Your kindness can save lives!
        </Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Address Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter your address"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              placeholder="City"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="Zip"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Home Information
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Home Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Home Type *</Text>
          <View style={styles.optionRow}>
            {homeTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  formData.homeType === type && styles.optionButtonSelected
                ]}
                onPress={() => handleInputChange('homeType', type)}
              >
                <Text style={[
                  styles.optionText,
                  formData.homeType === type && styles.optionTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleBooleanToggle('hasYard')}
          >
            <View style={[styles.checkbox, formData.hasYard && styles.checkboxChecked]}>
              {formData.hasYard && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>I have a yard/outdoor space</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleBooleanToggle('hasOtherPets')}
          >
            <View style={[styles.checkbox, formData.hasOtherPets && styles.checkboxChecked]}>
              {formData.hasOtherPets && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>I have other pets</Text>
          </TouchableOpacity>
        </View>

        {formData.hasOtherPets && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tell us about your other pets</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.otherPetsDetails}
              onChangeText={(value) => handleInputChange('otherPetsDetails', value)}
              placeholder="Describe your current pets..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
        )}
      </View> */}

      {/* Foster Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foster Preferences</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Pet Types *</Text>
          <View style={styles.petTypeGrid}>
            {petTypes.map((petType) => (
              <TouchableOpacity
                key={petType}
                style={[
                  styles.petTypeButton,
                  formData.preferredPets.includes(petType) && styles.petTypeButtonSelected
                ]}
                onPress={() => handlePetTypeToggle(petType)}
              >
                <Text style={[
                  styles.petTypeText,
                  formData.preferredPets.includes(petType) && styles.petTypeTextSelected
                ]}>
                  {petType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum number of pets you can foster</Text>
          <TextInput
            style={styles.input}
            value={formData.maxPets}
            onChangeText={(value) => handleInputChange('maxPets', value)}
            placeholder="e.g., 1 or 2"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Experience with pets</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.experience}
            onChangeText={(value) => handleInputChange('experience', value)}
            placeholder="Tell us about your experience with pets..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>When are you available? *</Text>
          <View style={styles.optionColumn}>
            {availabilityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioRow}
                onPress={() => handleInputChange('availability', option)}
              >
                <View style={[styles.radio, formData.availability === option && styles.radioSelected]}>
                  {formData.availability === option && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Contact Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.emergencyContact}
            onChangeText={(value) => handleInputChange('emergencyContact', value)}
            placeholder="Contact person name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Contact Phone *</Text>
          <TextInput
            style={styles.input}
            value={formData.emergencyPhone}
            onChangeText={(value) => handleInputChange('emergencyPhone', value)}
            placeholder="Contact person phone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Special requirements or notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.specialRequirements}
            onChangeText={(value) => handleInputChange('specialRequirements', value)}
            placeholder="Any special requirements, allergies, or additional information..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#faf9ff',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  optionButtonSelected: {
    backgroundColor: '#f1787e',
    borderColor: '#f1787e',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#f1787e',
    borderColor: '#f1787e',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  petTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  petTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
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
    fontWeight: '500',
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
  submitButton: {
    backgroundColor: '#f1787e',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 40,
  },
});