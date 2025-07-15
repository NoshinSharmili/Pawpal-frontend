import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function CreatePetPage() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

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

  const handleSubmit = () => {
    // Submit logic (API call etc.)
    router.push('/homepage');
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

      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age (e.g., 2 years)"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Pet</Text>
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
});
