import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/stores.js';
import ratingRoutes from './routes/ratings.js';
import authRoutes from './auth.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected via Sequelize');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (e) { console.error('Failed to start', e); process.exit(1); }
}

start();
