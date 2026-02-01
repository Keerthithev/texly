import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function TemplatesScreen() {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateText, setTemplateText] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/templates', { headers: { Authorization: `Bearer ${token}` } });
      setTemplates(res.data);
    };
    fetchTemplates();
  }, []);

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/templates', { templateName, templateText }, { headers: { Authorization: `Bearer ${token}` } });
    setTemplates([...templates, res.data]);
    setTemplateName('');
    setTemplateText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Templates</Text>
      <TextInput style={styles.input} placeholder="Template Name" value={templateName} onChangeText={setTemplateName} />
      <TextInput style={styles.input} placeholder="Template Text" value={templateText} onChangeText={setTemplateText} />
      <Button title="Add Template" onPress={handleAdd} color="#2563eb" />
      <FlatList
        data={templates}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Text style={styles.template}><Text style={{fontWeight:'bold'}}>{item.templateName}</Text>: {item.templateText}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  template: { fontSize: 16, marginVertical: 4 },
});
