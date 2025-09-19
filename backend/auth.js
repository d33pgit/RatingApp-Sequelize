import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './models/index.js';
import { validateUser } from './validators.js';

dotenv.config();
const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const errors = validateUser({ name, email, address, role: 'user', password });
    if (errors.length) return res.status(400).json({ errors });

    const user = await User.create({ name, email, address: address || '', role: 'user', password_hash: password });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address } });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ errors: ['Email already registered'] });
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
