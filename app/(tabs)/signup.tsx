import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

const screenHeight = Dimensions.get('window').height;

export default function SignUpPage() {
  const router = useRouter();
  const { setUserId } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        let msg = 'Signup failed.';
        try {
          const errData = await response.json();
          if (errData && errData.error && typeof errData.error === 'string') {
            if (errData.error.includes('duplicate key') || errData.error.includes('email')) {
              msg = 'An account with this email already exists.';
            } else {
              msg = errData.error;
            }
          }
        } catch {}
        throw new Error(msg);
      }
      // Now check session to get userId
      const sessionRes = await fetch('http://10.0.2.2:5000/api/users/session', {
        method: 'GET',
        credentials: 'include',
      });
      if (!sessionRes.ok) throw new Error('Session check failed');
      const sessionData = await sessionRes.json();
      if (!sessionData.loggedIn || !sessionData.userId) throw new Error('No userId returned');
      setUserId(sessionData.userId);
      alert('Signup successful!');
      router.back(); 
    } catch (err: any) {
      alert(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Heading */}
      <Text style={styles.welcomeText}>Create your account</Text>
      {/* Top Logo */}
      <View >
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@reallygreatsite.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Next'}</Text>
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
    marginBottom: -screenHeight * 0.05, // pulls form up behind the cat
  },
  formCard: {
    backgroundColor: '#d16d78',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: screenHeight * 0.08, // leaves space under the cat
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
  logo: {
    width: 230,
    height: 150,
  },
  welcomeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 80,
  },
});







