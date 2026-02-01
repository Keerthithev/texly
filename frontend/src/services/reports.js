import api from './api';

export const getHistory = async () => {
  const res = await api.get('/api/reports/history');
  return res.data;
};
