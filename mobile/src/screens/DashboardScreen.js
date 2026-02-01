import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Texly Dashboard</Text>
      <Button title="Send SMS" onPress={() => navigation.navigate('SendSMS')} color="#2563eb" />
      <Button title="Contacts" onPress={() => navigation.navigate('Contacts')} color="#2563eb" />
      <Button title="Templates" onPress={() => navigation.navigate('Templates')} color="#2563eb" />
      <Button title="Reports" onPress={() => navigation.navigate('Reports')} color="#2563eb" />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} color="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 32 },
});
