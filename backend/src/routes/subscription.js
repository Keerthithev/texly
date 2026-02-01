import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createCheckoutSession } from '../services/paymentService.js';
import Subscription from '../models/Subscription.js';
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const subs = await Subscription.find({ userID: req.user.id });
  res.json(subs);
});

router.post('/checkout', authenticate, async (req, res) => {
  const { plan } = req.body;
  try {
    const session = await createCheckoutSession(req.user.id, plan);
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
