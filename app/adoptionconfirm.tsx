import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Thank You!</Text>
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
