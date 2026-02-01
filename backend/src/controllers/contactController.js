import Contact from '../models/Contact.js';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userID: req.user.id });
  res.json(contacts);
};

export const addContact = async (req, res) => {
  const { name, phoneNumber, group } = req.body;
  const contact = await Contact.create({ userID: req.user.id, name, phoneNumber, group });
  res.status(201).json(contact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, group } = req.body;
  const contact = await Contact.findOneAndUpdate(
    { _id: id, userID: req.user.id },
    { name, phoneNumber, group },
    { new: true }
  );
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndDelete({ _id: id, userID: req.user.id });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json({ message: 'Contact deleted' });
};
