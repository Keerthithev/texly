import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ReportsScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reports/history', { headers: { Authorization: `Bearer ${token}` } });
      setHistory(res.data);
    };
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Message: {item.message}</Text>
            <Text>Recipients: {item.recipients.join(', ')}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Time: {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
});
