import { Router } from "express";
import { User, Store, Rating } from "../models/index.js";
import { validateUser, validateStore } from "../validators.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

/**
 * Dashboard stats
 */
router.get("/dashboard", async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ users, stores, ratings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Users
 */

// Create user
router.post("/users", async (req, res) => {
  try {
    const { name, email, address = "", role = "user", password } = req.body;
    const errors = validateUser({ name, email, address, role, password });
    if (errors.length) return res.status(400).json({ errors });

    // hash password before save
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      role,
      password_hash: hashed,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError")
      return res.status(400).json({ errors: ["Email already exists"] });
    res.status(500).json({ error: e.message });
  }
});

// List users
router.get("/users", async (req, res) => {
  try {
    const { name, email, address, role, sort = "name", order = "ASC" } =
      req.query;
    const where = {};
    if (name) where.name = { $ilike: `%${name}%` };
    if (email) where.email = { $ilike: `%${email}%` };
    if (address) where.address = { $ilike: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      attributes: ["id", "name", "email", "address", "role"],
      where,
      order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    });

    res.json(users.map((u) => u.toJSON()));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, email, address, role, password } = req.body;
    const updates = { name, email, address, role };

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    await user.update(updates);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Stores
 */

// Create store
router.post("/stores", async (req, res) => {
  try {
    const { name, email = null, address = "", owner_id = null } = req.body;
    const errors = validateStore({ name, email, address, owner_id });
    if (errors.length) return res.status(400).json({ errors });

    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner_id || null,
    });

    res.status(201).json(store);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List stores
router.get("/stores", async (req, res) => {
  try {
    const { name, address, sort = "name", order = "ASC" } = req.query;
    const where = {};
    if (name) where.name = { $ilike: `%${name}%` };
    if (address) where.address = { $ilike: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sort, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    });

    const withAvg = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findAll({
          where: { store_id: s.id },
          attributes: [
            [
              Rating.sequelize.fn(
                "ROUND",
                Rating.sequelize.fn("AVG", Rating.sequelize.col("rating")),
                2
              ),
              "avg_rating",
            ],
          ],
        });
        const obj = s.toJSON();
        obj.avg_rating =
          avg && avg[0] && avg[0].dataValues && avg[0].dataValues.avg_rating
            ? avg[0].dataValues.avg_rating
            : null;
        return obj;
      })
    );

    res.json(withAvg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update store
router.put("/stores/:id", async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const { name, email, address, owner_id } = req.body;
    await store.update({ name, email, address, owner_id });

    res.json(store);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete store
router.delete("/stores/:id", async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    await store.destroy();
    res.json({ message: "Store deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
