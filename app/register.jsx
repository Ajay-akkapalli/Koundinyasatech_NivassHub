import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
 
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TouchableOpacity style={styles.registerButton} onPress={() => {}}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
  },
  registerButton: {
    backgroundColor: '#1A237E',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 20,
    color: '#1A237E',
    fontSize: 16,
    textAlign: 'center',
  },
});