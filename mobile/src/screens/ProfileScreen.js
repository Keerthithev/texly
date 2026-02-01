import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  // In a real app, fetch user info from API or AsyncStorage
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.card}>
        <Text>Name: Demo User</Text>
        <Text>Email: demo@texly.com</Text>
        <Text>Role: business</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 8, alignItems: 'flex-start', width: 300 },
});
