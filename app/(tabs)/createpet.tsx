import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

const screenHeight = Dimensions.get('window').height;

export default function CreatePetPage() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState(false);
  const [feedingStatus, setFeedingStatus] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState('');
  const [needVaccination, setNeedVaccination] = useState(false);
  const [transferredFood, setTransferredFood] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();
  console.log(userId);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    console.log(name);
    // if (name === "") {
    //   Alert.alert('Validation', 'Pet name is required.');
    //   return;
    // }
    // if (!userId) {
    //   Alert.alert('Error', 'User not logged in.');
    //   return;
    // }
    console.log(name);
    // setLoading(true);
    try {
      const body = {
        name,
        type,
        breed,
        dob: dob ? new Date(dob) : null,
        healthStatus,
        vaccinationStatus,
        feedingStatus,
        adoptionStatus,
        needVaccination,
        transferredFood,
        userId,
        location,
      };
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to create pet');
      Alert.alert('Success', 'Pet created successfully!');
      router.push('/homepage');
    } catch (err) {
      Alert.alert('Error', 'Failed to create pet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add a Pet for Adoption</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Upload Pet Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Pet Name*" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Type (e.g., Cat, Dog)" value={type} onChangeText={setType} />
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
      
      <TextInput style={styles.input} placeholder="Health Status" value={healthStatus} onChangeText={setHealthStatus} />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Vaccinated?</Text>
        <Switch value={vaccinationStatus} onValueChange={setVaccinationStatus} />
      </View>
      <TextInput style={styles.input} placeholder="Feeding Status" value={feedingStatus} onChangeText={setFeedingStatus} />
      <TextInput style={styles.input} placeholder="Adoption Status" value={adoptionStatus} onChangeText={setAdoptionStatus} />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Needs Vaccination?</Text>
        <Switch value={needVaccination} onValueChange={setNeedVaccination} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Transferred Food?</Text>
        <Switch value={transferredFood} onValueChange={setTransferredFood} />
      </View>
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Pet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: screenHeight * 0.05,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d16d78',
    marginBottom: 20,
  },
  imagePicker: {
    width: 160,
    height: 160,
    backgroundColor: '#f5f5f5',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#aaa',
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#d16d78',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#d16d78',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between', width: '100%' },
  switchLabel: { fontSize: 14, color: '#333' }
});
