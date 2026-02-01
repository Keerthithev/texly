import api from './api';

export const startCheckout = async (plan) => {
  const res = await api.post('/api/subscriptions/checkout', { plan });
  return res.data.url;
};
