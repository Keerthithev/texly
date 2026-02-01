import api from './api';

export const getSubscriptions = async () => {
  const res = await api.get('/api/subscriptions');
  return res.data;
};
