import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
const screenHeight = Dimensions.get('window').height;

interface FormErrors {
  fullName?: string | null;
  profession?: string | null;
  email?: string | null;
  address?: string | null;
  familyInformation?: string | null;
  nidNumber?: string | null;
  phoneNumber?: string | null;
  reasonToAdopt?: string | null;
}

export default function AdoptionForm() {
  const router = useRouter();
  const { userId } = useUser();
  const { petId } = useLocalSearchParams();
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isHousePetProofed, setIsHousePetProofed] = useState(false);
  const [familyInformation, setFamilyInformation] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reasonToAdopt, setReasonToAdopt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's between 10-15 digits (international format)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const validateNID = (nid: string): boolean => {
    // Assuming NID should be numeric and between 10-17 digits
    const cleanNID = nid.replace(/\D/g, '');
    return cleanNID.length >= 10 && cleanNID.length <= 17;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!profession.trim()) {
      newErrors.profession = 'Profession is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
    }

    if (!familyInformation.trim()) {
      newErrors.familyInformation = 'Family information is required';
    } else if (familyInformation.trim().length < 10) {
      newErrors.familyInformation = 'Please provide more detailed family information';
    }

    if (!nidNumber.trim()) {
      newErrors.nidNumber = 'NID number is required';
    } else if (!validateNID(nidNumber)) {
      newErrors.nidNumber = 'Please enter a valid NID number (10-17 digits)';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!reasonToAdopt.trim()) {
      newErrors.reasonToAdopt = 'Please explain why you want to adopt';
    } else if (reasonToAdopt.trim().length < 20) {
      newErrors.reasonToAdopt = 'Please provide a more detailed explanation (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/adoption-applications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId,
          fullName: fullName.trim(),
          profession: profession.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          isHousePetProofed,
          familyInformation: familyInformation.trim(),
          nidNumber: nidNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          reasonToAdopt: reasonToAdopt.trim(),
          userId
        }),
      });
      if (!response.ok) throw new Error('Failed to submit application');
      Alert.alert('Success', 'Adoption application submitted successfully!');
      router.push('/adoptionconfirm');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (field: keyof FormErrors, value: string, setter: (value: string) => void): void => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Adoption Application</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput 
          style={[styles.input, errors.fullName && styles.inputError]} 
          placeholder="John Doe" 
          placeholderTextColor="#999" 
          value={fullName} 
          onChangeText={(value) => handleInputChange('fullName', value, setFullName)}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profession *</Text>
        <TextInput 
          style={[styles.input, errors.profession && styles.inputError]} 
          placeholder="Your Profession" 
          placeholderTextColor="#999" 
          value={profession} 
          onChangeText={(value) => handleInputChange('profession', value, setProfession)}
        />
        {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput 
          style={[styles.input, errors.email && styles.inputError]} 
          placeholder="john@example.com" 
          keyboardType="email-address" 
          autoCapitalize="none"
          placeholderTextColor="#999" 
          value={email} 
          onChangeText={(value) => handleInputChange('email', value, setEmail)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address *</Text>
        <TextInput 
          style={[styles.input, errors.address && styles.inputError]} 
          placeholder="123 Main St, City, Country" 
          placeholderTextColor="#999" 
          value={address} 
          onChangeText={(value) => handleInputChange('address', value, setAddress)}
          multiline
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Is your house pet-proofed?</Text>
        <View style={styles.switchContainer}>
          <Switch 
            value={isHousePetProofed} 
            onValueChange={setIsHousePetProofed}
            trackColor={{ false: '#ccc', true: '#d16d78' }}
            thumbColor={isHousePetProofed ? '#fff' : '#f4f3f4'}
          />
          <Text style={styles.switchLabel}>
            {isHousePetProofed ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Family Information *</Text>
        <TextInput 
          style={[styles.input, { height: 80 }, errors.familyInformation && styles.inputError]} 
          placeholder="Please describe your family members, their ages, and experience with pets" 
          placeholderTextColor="#999" 
          value={familyInformation} 
          onChangeText={(value) => handleInputChange('familyInformation', value, setFamilyInformation)}
          multiline
        />
        {errors.familyInformation && <Text style={styles.errorText}>{errors.familyInformation}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>NID Number *</Text>
        <TextInput 
          style={[styles.input, errors.nidNumber && styles.inputError]} 
          placeholder="Your NID Number" 
          placeholderTextColor="#999" 
          value={nidNumber} 
          onChangeText={(value) => handleInputChange('nidNumber', value, setNidNumber)}
          keyboardType="numeric"
        />
        {errors.nidNumber && <Text style={styles.errorText}>{errors.nidNumber}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput 
          style={[styles.input, errors.phoneNumber && styles.inputError]} 
          placeholder="+1234567890" 
          keyboardType="phone-pad" 
          placeholderTextColor="#999" 
          value={phoneNumber} 
          onChangeText={(value) => handleInputChange('phoneNumber', value, setPhoneNumber)}
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Why do you want to adopt? *</Text>
        <TextInput 
          style={[styles.input, { height: 100 }, errors.reasonToAdopt && styles.inputError]} 
          multiline 
          placeholder="Please explain your reasons for wanting to adopt this pet, your experience with pets, and how you plan to care for them..." 
          placeholderTextColor="#999" 
          value={reasonToAdopt} 
          onChangeText={(value) => handleInputChange('reasonToAdopt', value, setReasonToAdopt)}
        />
        {errors.reasonToAdopt && <Text style={styles.errorText}>{errors.reasonToAdopt}</Text>}
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  switchLabel: {
    marginLeft: 10,
    color: '#555',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#d16d78',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});