
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen() {

      useEffect(() => {
        const timer = setTimeout(() => {
          router.push('/homepage'); 
        }, 2000); 

        return () => clearTimeout(timer);
      }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank You!🎉 </Text>
      <Text style={styles.message}>
        Your adoption application has been submitted successfully.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    color: '#d16d78',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
