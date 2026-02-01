import Subscription from '../models/Subscription.js';
import { createCheckoutSession } from '../services/paymentService.js';

export const getSubscriptions = async (req, res) => {
  const subs = await Subscription.find({ userID: req.user.id });
  res.json(subs);
};

export const checkout = async (req, res) => {
  const { plan } = req.body;
  try {
    const session = await createCheckoutSession(req.user.id, plan);
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
