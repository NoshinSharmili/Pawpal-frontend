import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

const screenHeight = Dimensions.get('window').height;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserId } = useUser();
  
  const handleLogin = async () => {
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (!data.userId) throw new Error('No userId returned');
      
      
      setUserId(data.userId);
      router.replace('/homepage');
    } catch (err) {
      Alert.alert('Login failed', 'Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Heading */}
      <Text style={styles.welcomeText}>Sign in to continue</Text>
      {/* Logo */}
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Cat image overlapping card */}
      <View style={styles.catWrapper}>
        <Image
          source={require('@/assets/images/cat.png')}
          style={styles.catImage}
          resizeMode="contain"
        />
      </View>
      {/* Login Form Card */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Log in</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="hello@reallygreatsite.com"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
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
  welcomeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 30,
    marginBottom: 8,
  },
  logo: {
    width: 130,
    height: 60,
    marginBottom: 0,
  },
  catWrapper: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
    marginBottom: - 40,
  },
  catImage: {
    width: 150,
    height: 150,
  },
  formContainer: {
    backgroundColor: '#d16d78',
    width: '100%',
    maxWidth: 400,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: screenHeight * 0.1,
    paddingBottom: 80,
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
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
  forgotPassword: {
    marginTop: 14,
    fontSize: 13,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

