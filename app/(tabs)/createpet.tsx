import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  const [categoryError, setCategoryError] = useState('');
  const { userId } = useUser();
  console.log(userId);
  const router = useRouter();

  const getFileNameAndType = (uri: string) => {
    const fileName = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(fileName);
    const fileType = match ? `image/${match[1]}` : 'image/jpeg';
    return { fileName, fileType };
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const { fileName, fileType } = getFileNameAndType(asset.uri);
      try {
        // 1. Get presigned URL
        const presignRes = await fetch('http://10.0.2.2:5000/api/pets/presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, fileType }),
        });
        if (!presignRes.ok) throw new Error('Failed to get presigned URL');
        const { uploadURL, key } = await presignRes.json();
        // 2. Upload image to S3
        const img = await fetch(asset.uri);
        const blob = await img.blob();
        const uploadRes = await fetch(uploadURL, {
          method: 'PUT',
          headers: { 'Content-Type': fileType },
          body: blob,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        // 3. Save the S3 image URL (public URL)
        // You may need to adjust this URL based on your S3 bucket's public access pattern
        const imageUrl = uploadURL.split('?')[0];
        setImage(imageUrl);
      } catch (err) {
        Alert.alert('Error', 'Image upload failed.');
      }
    }
  };

  const handleSubmit = async () => {
    setAdoptionStatus("personal");
    setCategoryError('');
    if (!type) {
      setCategoryError('Please select a pet category.');
      return;
    }
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
        image, // <-- add image URL
      };
      const response = await fetch('http://10.0.2.2:5000/api/pets', {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Add a Pet</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Upload Pet Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Pet Name*" value={name} onChangeText={setName} />
      <View style = {styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue: string) => setType(itemValue)}
        >
          <Picker.Item label="Select Category*" value="" />
          <Picker.Item label="Cats" value="cats" />
          <Picker.Item label="Dogs" value="dogs" />
          <Picker.Item label="Rabbits" value="rabbits" />
          <Picker.Item label="Birds" value="birds" />
          <Picker.Item label="Others" value="others" />
        </Picker>
        </View>
      
      {categoryError ? <Text style={{ color: 'red', marginBottom: 10 }}>{categoryError}</Text> : null}
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
      
      <TextInput style={styles.input} placeholder="Health Status" value={healthStatus} onChangeText={setHealthStatus} />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Vaccinated?</Text>
        <Switch value={vaccinationStatus} onValueChange={setVaccinationStatus} />
      </View>
      {/* <TextInput style={styles.input} placeholder="Feeding Status" value={feedingStatus} onChangeText={setFeedingStatus} />
      <TextInput style={styles.input} placeholder="Adoption Status" value={adoptionStatus} onChangeText={setAdoptionStatus} /> */}
      
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Needs Vaccination?</Text>
        <Switch value={needVaccination} onValueChange={setNeedVaccination} />
      </View>
      {/* <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Transferred Food?</Text>
        <Switch value={transferredFood} onValueChange={setTransferredFood} />
      </View> */}
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Pet'}</Text>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
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
  switchLabel: { fontSize: 14, color: '#333' },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#d16d78',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#d16d78',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
});
