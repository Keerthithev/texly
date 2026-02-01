import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const updateMe = async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email, phone }, { new: true });
  res.json(user);
};

export const updateRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json(user);
};
