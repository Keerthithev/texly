import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { sendSMS, scheduleSMS } from '../services/smsService.js';
import SMS from '../models/SMS.js';
const router = express.Router();

router.post('/send', authenticate, async (req, res) => {
  try {
    const { recipients, message, senderID } = req.body;
    const results = await Promise.all(recipients.map(to => sendSMS({ to, message })));
    const sms = await SMS.create({ senderID, message, recipients, status: 'sent', user: req.user.id });
    res.json({ message: 'SMS sent', results, sms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/schedule', authenticate, async (req, res) => {
  try {
    const { recipients, message, senderID, scheduleTime } = req.body;
    const scheduled = await scheduleSMS({ to: recipients, message, scheduleTime });
    const sms = await SMS.create({ senderID, message, recipients, status: 'scheduled', scheduleTime, user: req.user.id });
    res.json({ message: 'SMS scheduled', scheduled, sms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
