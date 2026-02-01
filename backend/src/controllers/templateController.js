import Template from '../models/Template.js';

export const getTemplates = async (req, res) => {
  const templates = await Template.find({ userID: req.user.id });
  res.json(templates);
};

export const addTemplate = async (req, res) => {
  const { templateName, templateText } = req.body;
  const template = await Template.create({ userID: req.user.id, templateName, templateText });
  res.status(201).json(template);
};

export const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { templateName, templateText } = req.body;
  const template = await Template.findOneAndUpdate(
    { _id: id, userID: req.user.id },
    { templateName, templateText },
    { new: true }
  );
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
};

export const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  const template = await Template.findOneAndDelete({ _id: id, userID: req.user.id });
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ message: 'Template deleted' });
};
