import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function toPublicUser(user) {
  return { name: user.name, email: user.email, avatar: user.avatar };
}


router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });

    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Signup failed:', err);
    res.status(500).json({ error: 'Something went wrong creating your account' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString());
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Something went wrong logging you in' });
  }
});


router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toPublicUser(user) });
});


router.patch('/avatar', requireAuth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { avatar }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('Avatar update failed:', err);
    res.status(500).json({ error: 'Could not update photo' });
  }
});

export default router;