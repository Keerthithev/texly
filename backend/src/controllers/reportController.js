import SMS from '../models/SMS.js';

export const getHistory = async (req, res) => {
  const history = await SMS.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(history);
};

export const getStatus = async (req, res) => {
  const sms = await SMS.findById(req.params.id);
  if (!sms) return res.status(404).json({ message: 'Not found' });
  res.json({ status: sms.status });
};
