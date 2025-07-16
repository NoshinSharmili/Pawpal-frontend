import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

export default function AdoptionForm() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/adoptionconfirm'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adoption Application</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#999" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} placeholder="john@example.com" keyboardType="email-address" placeholderTextColor="#999" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="+1234567890" keyboardType="phone-pad" placeholderTextColor="#999" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="123 Main St, City, Country" placeholderTextColor="#999" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Why do you want to adopt?</Text>
        <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Write your answer..." placeholderTextColor="#999" />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Application</Text>
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

