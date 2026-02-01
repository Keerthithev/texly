import api from './api';

export const getTemplates = async () => {
  const res = await api.get('/api/templates');
  return res.data;
};

export const addTemplate = async (templateName, templateText) => {
  const res = await api.post('/api/templates', { templateName, templateText });
  return res.data;
};

export const updateTemplate = async (id, templateName, templateText) => {
  const res = await api.put(`/api/templates/${id}`, { templateName, templateText });
  return res.data;
};

export const deleteTemplate = async (id) => {
  const res = await api.delete(`/api/templates/${id}`);
  return res.data;
};
