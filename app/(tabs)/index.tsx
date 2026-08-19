import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{height: 70}}></View>
      <Text testID="landing-welcome-text" style={styles.welcomeText}>Welcome to</Text>
      <Image
          source={require('@/assets/images/logo.png')}
          style={styles.imageLogo}
          resizeMode="contain"
        />

      {/* Positioned Cat Image */}
      
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
      <View style={{height: 70}}></View>
        <TouchableOpacity
          testID="landing-login-button"
          accessibilityLabel="Login"
          accessibilityRole="button"
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Login </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="landing-signup-button"
          accessibilityLabel="Sign Up"
          accessibilityRole="button"
          style={styles.button}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}></View>
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
    fontWeight:'bold',
    fontFamily: 'Arial',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 20,
  },
  imageWrapper: {
    zIndex: 1,
    position: 'relative',
    marginBottom: -screenHeight * 0.04, // pushes the image down
  },
  image: {
    width: 180,
    height: 180,
  },
  imageLogo: {
    width: 400,
    height: 150,
    marginBottom: 10
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
    width: '60%',
    height: 50,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
