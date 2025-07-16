import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function AdoptionForm() {
  const router = useRouter();
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

  const handleSubmit = async () => {
    // if (!petId || !fullName || !profession || !email || !address || !familyInformation || !nidNumber || !phoneNumber || !reasonToAdopt) {
    //   Alert.alert('Error', 'Please fill in all required fields.');
    //   return;
    // }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/adoption-applications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId,
          fullName,
          profession,
          email,
          address,
          isHousePetProofed,
          familyInformation,
          nidNumber,
          phoneNumber,
          reasonToAdopt,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit application');
      Alert.alert('Success', 'Adoption application submitted!');
      router.push('/adoptionconfirm');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adoption Application</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#999" value={fullName} onChangeText={setFullName} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profession</Text>
        <TextInput style={styles.input} placeholder="Your Profession" placeholderTextColor="#999" value={profession} onChangeText={setProfession} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} placeholder="john@example.com" keyboardType="email-address" placeholderTextColor="#999" value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="123 Main St, City, Country" placeholderTextColor="#999" value={address} onChangeText={setAddress} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Is your house pet-proofed?</Text>
        <Switch value={isHousePetProofed} onValueChange={setIsHousePetProofed} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Family Information</Text>
        <TextInput style={styles.input} placeholder="Family details" placeholderTextColor="#999" value={familyInformation} onChangeText={setFamilyInformation} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>NID Number</Text>
        <TextInput style={styles.input} placeholder="Your NID Number" placeholderTextColor="#999" value={nidNumber} onChangeText={setNidNumber} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="+1234567890" keyboardType="phone-pad" placeholderTextColor="#999" value={phoneNumber} onChangeText={setPhoneNumber} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Why do you want to adopt?</Text>
        <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Write your answer..." placeholderTextColor="#999" value={reasonToAdopt} onChangeText={setReasonToAdopt} />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Application'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    minHeight: screenHeight,
  },
  header: {
    fontSize: 26,
    color: '#d16d78',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
  },
  submitButton: {
    backgroundColor: '#d16d78',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

