import { Router } from 'express';
import { Rating } from '../models/index.js';
import { validateRating } from '../validators.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, store_id, rating } = req.body;
    const errors = validateRating({ user_id, store_id, rating });
    if (errors.length) return res.status(400).json({ errors });
    const [rec, created] = await Rating.upsert({ user_id, store_id, rating }, { returning: true });
    res.status(201).json(rec);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
