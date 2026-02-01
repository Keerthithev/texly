import api from './api';

export const getContacts = async () => {
  const res = await api.get('/api/contacts');
  return res.data;
};

export const addContact = async (name, phoneNumber, group) => {
  const res = await api.post('/api/contacts', { name, phoneNumber, group });
  return res.data;
};

export const updateContact = async (id, name, phoneNumber, group) => {
  const res = await api.put(`/api/contacts/${id}`, { name, phoneNumber, group });
  return res.data;
};

export const deleteContact = async (id) => {
  const res = await api.delete(`/api/contacts/${id}`);
  return res.data;
};
