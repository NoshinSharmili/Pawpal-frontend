import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function PetProfileScreen() {
  // Dummy pet data
  const [pet] = useState({
    name: 'Milo',
    breed: 'Persian Cat',
    age: 3,
    vaccinationStatus: 'Up to Date',
    healthCondition: 'Healthy',
    notes: 'Very playful, loves to sleep in the sun.',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Pet Profile</Text>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{pet.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Breed:</Text>
          <Text style={styles.value}>{pet.breed}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{pet.age} years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vaccination Status:</Text>
          <Text style={styles.value}>{pet.vaccinationStatus}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Health Condition:</Text>
          <Text style={styles.value}>{pet.healthCondition}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Care Notes:</Text>
          <Text style={styles.value}>{pet.notes}</Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Pet Info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C74C58',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFE9EC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    // iOS shadow
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#C74C58',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


const styles = StyleSheet.create({
  container: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold' }
});
