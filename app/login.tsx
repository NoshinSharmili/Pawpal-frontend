import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function LoginPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Image
          source={require('@/assets/images/logo.png')}
          style={styles.imageLogo}
          resizeMode="contain"
        />

      {/* Positioned Cat Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('@/assets/images/cat.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Login/Sign Up Card */}
      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight:'bold'
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C74C58',
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#FFFFFF'
  },
  imageWrapper: {
    zIndex: 1,
    position: 'relative',
    marginBottom: -screenHeight * 0.34, // pushes the image down
  },
  image: {
    width: 180,
    height: 180,
  },
  imageLogo: {
    width: 180,
    height: 100,
    marginBottom: 10
  },
  buttonContainer: {
    zIndex: 2,
    backgroundColor: '#d16d78',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    paddingTop: screenHeight * 0.05, // creates the visual padding above buttons
    paddingBottom: screenHeight * 0.15, // creates the visual padding above buttons
  },
  button: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
