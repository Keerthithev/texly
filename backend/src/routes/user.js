import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

router.put('/me', authenticate, async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email, phone }, { new: true });
  res.json(user);
});

// Admin: update role
router.put('/:id/role', authenticate, authorize(['admin']), async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json(user);
});

export default router;
