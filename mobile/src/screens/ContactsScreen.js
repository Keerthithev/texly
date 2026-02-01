import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/contacts', { headers: { Authorization: `Bearer ${token}` } });
      setContacts(res.data);
    };
    fetchContacts();
  }, []);

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/contacts', { name, phoneNumber }, { headers: { Authorization: `Bearer ${token}` } });
    setContacts([...contacts, res.data]);
    setName('');
    setPhoneNumber('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
      <Button title="Add Contact" onPress={handleAdd} color="#2563eb" />
      <FlatList
        data={contacts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Text style={styles.contact}>{item.name} - {item.phoneNumber}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  contact: { fontSize: 16, marginVertical: 4 },
});
