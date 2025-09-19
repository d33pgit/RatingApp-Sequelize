import './db.js';
import { sequelize, User, Store, Rating } from './models/index.js';

async function run() {
  await sequelize.sync({ force: false });

  const u1 = await User.create({ name: 'Admin', email: 'admin@admin.com', address: 'abcde', role: 'admin', password_hash: 'Admin@123' });
  const u2 = await User.create({ name: 'StoreOwner', email: 'Owner@store.com', address: 'Maharastra', role: 'owner', password_hash: 'Owner@123!' });
  const u3 = await User.create({ name: 'User', email: 'user@abc.com', address: 'Delhi', role: 'user', password_hash: 'User@123!' });

  const s1 = await Store.create({ name: 'ABC', email: 'abc@abc.com', address: 'Pune', owner_id: u2.id });
  const s2 = await Store.create({ name: 'Books shop', email: 'hello@books.com', address: 'Pune', owner_id: u3.id });
  const s3 = await Store.create({ name: 'Electronics', email: 'contact@us.com', address: 'Pune' });

  await Rating.create({ user_id: u4.id, store_id: s1.id, rating: 5 });
  await Rating.create({ user_id: u5.id, store_id: s1.id, rating: 4 });
  await Rating.create({ user_id: u4.id, store_id: s2.id, rating: 3 });

  console.log('Seed complete');
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
