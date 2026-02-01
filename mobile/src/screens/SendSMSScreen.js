import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SendSMSScreen() {
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sms/send', {
        recipients: recipients.split(',').map(s => s.trim()),
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'SMS sent successfully!');
      setRecipients('');
      setMessage('');
    } catch (err) {
      Alert.alert('Error', 'Failed to send SMS');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send SMS</Text>
      <TextInput style={styles.input} placeholder="Recipients (comma separated)" value={recipients} onChangeText={setRecipients} />
      <TextInput style={styles.input} placeholder="Message" value={message} onChangeText={setMessage} multiline numberOfLines={4} />
      <Button title="Send" onPress={handleSend} color="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 24 },
  input: { width: '80%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' },
});
