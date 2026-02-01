import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import Template from '../models/Template.js';
import Subscription from '../models/Subscription.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Contact.deleteMany();
  await Template.deleteMany();
  await Subscription.deleteMany();

  const user = await User.create({
    name: 'Admin User',
    email: 'admin@texly.com',
    password: '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q', // 'password' hashed
    role: 'admin',
    senderIDs: ['TEXLY']
  });

  await Contact.create({
    userID: user._id,
    name: 'John Doe',
    phoneNumber: '+11234567890',
    group: 'Customers'
  });

  await Template.create({
    userID: user._id,
    templateName: 'Welcome',
    templateText: 'Welcome to Texly!'
  });

  await Subscription.create({
    userID: user._id,
    plan: 'premium',
    credits: 1000
  });

  console.log('Seed data inserted');
  process.exit();
};

seed();
