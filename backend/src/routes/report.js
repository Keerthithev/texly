import express from 'express';
import { authenticate } from '../middleware/auth.js';
import SMS from '../models/SMS.js';
const router = express.Router();

router.get('/history', authenticate, async (req, res) => {
  const history = await SMS.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(history);
});

router.get('/status/:id', authenticate, async (req, res) => {
  const sms = await SMS.findById(req.params.id);
  if (!sms) return res.status(404).json({ message: 'Not found' });
  res.json({ status: sms.status });
});

export default router;
