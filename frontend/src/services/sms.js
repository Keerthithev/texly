import api from './api';

export const sendSMS = async (recipients, message) => {
  return api.post('/api/sms/send', { recipients, message });
};

export const scheduleSMS = async (recipients, message, scheduleTime) => {
  return api.post('/api/sms/schedule', { recipients, message, scheduleTime });
};
