import { Router } from 'express';
import { Store, Rating } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { searchName, searchAddress, userId, sort = 'name', order = 'asc' } = req.query;
    const where = {};
    if (searchName) where.name = { $ilike: `%${searchName}%` };
    if (searchAddress) where.address = { $ilike: `%${searchAddress}%` };

    const stores = await Store.findAll({ where, order: [[sort, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']] });

    const results = await Promise.all(stores.map(async (s) => {
      const avg = await Rating.findAll({ where: { store_id: s.id }, attributes: [[Rating.sequelize.fn('ROUND', Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')),2), 'avg_rating']] });
      const obj = s.toJSON();
      obj.avg_rating = (avg && avg[0] && avg[0].dataValues && avg[0].dataValues.avg_rating) ? avg[0].dataValues.avg_rating : null;
      return obj;
    }));

    if (!userId) return res.json(results);

    const ur = await Rating.findAll({ where: { user_id: Number(userId) } });
    const map = new Map(ur.map((x) => [x.store_id, x.rating]));
    const merged = results.map((row) => ({ ...row, user_rating: map.get(row.id) || null }));
    res.json(merged);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id/ratings', async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Rating.findAll({ where: { store_id: id }, include: [{ association: 'user', attributes: ['id','name','email','address'] }] });
    const averageObj = await Rating.findAll({ where: { store_id: id }, attributes: [[Rating.sequelize.fn('ROUND', Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')),2), 'avg']] });
    const avg = (averageObj && averageObj[0] && averageObj[0].dataValues && averageObj[0].dataValues.avg) ? averageObj[0].dataValues.avg : null;
    const rows = r.map((rr) => ({ user_id: rr.user.id, name: rr.user.name, email: rr.user.email, address: rr.user.address, rating: rr.rating }));
    res.json({ average: avg, ratings: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
