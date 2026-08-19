import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';
import { API_BASE_URL } from '../../config/api';

const screenHeight = Dimensions.get('window').height;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserId } = useUser();
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      // Now check session to get userId
      const sessionRes = await fetch(`${API_BASE_URL}/api/users/session`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!sessionRes.ok) throw new Error('Session check failed');
      const sessionData = await sessionRes.json();
      if (!sessionData.loggedIn || !sessionData.userId) throw new Error('No userId returned');
      setUserId(sessionData.userId);
      router.replace('/homepage');
    } catch (err) {
      Alert.alert('Login failed', 'Please check your email and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Heading */}
      <Text testID="login-heading" style={styles.welcomeText}>Sign in to continue</Text>
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
        <Text testID="login-title" style={styles.title}>Log in</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            testID="login-email-input"
            accessibilityLabel="Email"
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
            testID="login-password-input"
            accessibilityLabel="Password"
            placeholder="••••••"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          testID="login-submit-button"
          accessibilityLabel="Login"
          accessibilityRole="button"
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text testID="login-submit-text" style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="login-forgot-password" accessibilityRole="button">
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 18, justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13 }}>Don't have an account?</Text>
          <TouchableOpacity
            testID="login-signup-link"
            accessibilityLabel="Sign up"
            accessibilityRole="button"
            onPress={() => router.push('/signup')}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline', marginLeft: 4 }}>Sign up!</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.bottomContainer}></View> */}
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
    marginTop: 80,
    marginBottom: 8,
  },
  logo: {
    width: 230,
    height: 150,
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
  bottomContainer: {
    zIndex: 2,
    backgroundColor: '#d16d78',
    padding: 25,
    width: '100%',
    alignItems: 'center',
    paddingTop: screenHeight * 0.05, // creates the visual padding above buttons
    paddingBottom: screenHeight * 0.15, // creates the visual padding above buttons
  },
});

