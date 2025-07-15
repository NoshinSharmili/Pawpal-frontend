import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

export default function SignUpPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Cat Image (No Welcome) */}
      <View style={styles.catTopWrapper}>
        <Image
          source={require('@/assets/images/cat.png')}
          style={styles.catImage}
          resizeMode="contain"
        />
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Sign Up</Text>
          <FontAwesome name="paw" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Olivia Wilson"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@reallygreatsite.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}> Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  catTopWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    zIndex: 2,
  },
  catImage: {
    width: 160,
    height: 160,
    marginBottom: -screenHeight * 0.1, // pulls form up behind the cat
  },
  formCard: {
    backgroundColor: '#d16d78',
    width: '100%',
    maxWidth: 400,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: screenHeight * 0.12, // leaves space under the cat
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#d16d78',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
  },
  footerLink: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
});







